<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class EmpresaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_empresa = null;
    protected $nombre_empresa = null;
    protected $id_categoria = null;
    protected $id_cliente = null;

    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Método para buscar empresas por nombre.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                WHERE nombre_empresa LIKE ? 
                ORDER BY nombre_empresa';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    // Método para crear una nueva empresa.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_empresas(nombre_empresa)
                VALUES(?)';
        $params = array($this->nombre_empresa);
        return Database::executeRow($sql, $params);
    }


    // Método para obtener todas las empresas.
    public function readAll()
    {
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                ORDER BY id_empresa';
        return Database::getRows($sql);
    }

    // Método para obtener un reporte general de empresas.
    public function reporteGeneralEmpresa()
    {
        $sql = 'SELECT 
            e.id_empresa,
            e.nombre_empresa,
            COUNT(DISTINCT c.id_cliente) AS total_clientes,
            COUNT(DISTINCT p.id_producto) AS total_productos,
            SUM(d.cantidad_entidad) AS total_existencias,
            COUNT(DISTINCT env.id_envio) AS total_envios
        FROM 
            tb_empresas e
        LEFT JOIN 
            tb_clientes c ON e.id_empresa = c.id_empresa
        LEFT JOIN 
            tb_envios env ON c.id_cliente = env.id_cliente
        LEFT JOIN 
            tb_detalle_envios d ON env.id_envio = d.id_envio
        LEFT JOIN 
            tb_productos p ON d.id_entidad = p.id_producto
        GROUP BY 
            e.id_empresa, e.nombre_empresa
        ORDER BY 
            e.id_empresa;
        ';
        return Database::getRows($sql);
    }

    // Método para obtener los datos de una empresa específica por su ID.
    public function readOne()
    {
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                WHERE id_empresa = ?';
        $params = array($this->id_empresa);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar los datos de una empresa.
    public function updateRow()
    {
        $sql = 'UPDATE tb_empresas
                SET nombre_empresa = ?
                WHERE id_empresa = ?';
        $params = array($this->nombre_empresa, $this->id_empresa);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar una empresa.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_empresas
                WHERE id_empresa = ?';
        $params = array($this->id_empresa);
        return Database::executeRow($sql, $params);
    }
    public function existenciasSegunIdCategoria()
    {
        $sql = 'SELECT DISTINCT p.id_categoria, c.nombre AS nombre_categoria
            FROM tb_entidades e
            JOIN tb_productos p ON e.id_producto = p.id_producto
            JOIN tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
            JOIN tb_categorias c ON p.id_categoria = c.id_categoria
            WHERE e.existencias > 0;
            ';
        return Database::getRows($sql);
    }
    // Método para comparar existencias de productos por almacenamiento.
    public function compExistenciasProductos()
    {
        $sql = 'SELECT a.nombre_almacenamiento AS almacenamiento, SUM(e.existencias) AS total_existencias
            FROM tb_entidades e
            JOIN tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
            JOIN tb_productos p ON e.id_producto = p.id_producto
            WHERE p.id_categoria = ?  
            GROUP BY a.id_almacenamiento;

        ';
        $params = array($this->id_categoria);
        return Database::getRows($sql, $params);
    }

    // Método para obtener la evolución del costo de envío por cliente.
    public function evoCostoEnvioCliente()
    {
        $sql = 'SELECT e.fecha_estimada AS fecha, SUM(de.costo_envio) AS total_costo
        FROM tb_envios e
        JOIN tb_detalle_envios de ON e.id_envio = de.id_envio
        WHERE e.id_cliente = ?  
        GROUP BY e.fecha_estimada
        ORDER BY e.fecha_estimada;
        ;';
        $params = array($this->id_cliente);
        return Database::getRows($sql, $params);
    }
    public function clientesCompras()
    {
        $sql = 'SELECT DISTINCT e.id_cliente, c.nombre_cliente 
            FROM tb_envios e
            JOIN tb_detalle_envios de ON e.id_envio = de.id_envio
            JOIN tb_clientes c ON e.id_cliente = c.id_cliente
            WHERE de.costo_envio > 0;
            ';
        return Database::getRows($sql);
    }
}
