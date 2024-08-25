<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla CLIENTE.
*/
class ClienteHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $telefono = null;
    protected $direccion = null;
    protected $id_empresa = null;
    protected $fecha_registro = null;
    protected $id_envio = null;

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_electronico_cliente, direccion_cliente, nombre_empresa, numero_telefono_cliente, fecha_registro_cliente
                FROM tb_clientes
                INNER JOIN tb_empresas ON tb_clientes.id_empresa = tb_empresas.id_empresa
                WHERE apellido_cliente LIKE ? OR nombre_cliente LIKE ? OR correo_electronico_cliente LIKE ?
                ORDER BY apellido_cliente';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_clientes(nombre_cliente, apellido_cliente, correo_electronico_cliente, direccion_cliente, id_empresa, numero_telefono_cliente, fecha_registro_cliente)
                VALUES(?, ?, ?, ?, ?, ?, CURDATE())';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->direccion, $this->id_empresa, $this->telefono);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_electronico_cliente, direccion_cliente, nombre_empresa, numero_telefono_cliente, fecha_registro_cliente
                FROM tb_clientes
                INNER JOIN tb_empresas ON tb_clientes.id_empresa = tb_empresas.id_empresa
                ORDER BY id_cliente';
        return Database::getRows($sql);
    }


    public function readClientes()
    {
        $sql = 'SELECT id_cliente, nombre_cliente
                FROM tb_clientes
                ORDER BY id_cliente';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_electronico_cliente, direccion_cliente, tb_clientes.id_empresa, numero_telefono_cliente, fecha_registro_cliente
                FROM tb_clientes 
                INNER JOIN tb_empresas ON tb_clientes.id_empresa = tb_empresas.id_empresa
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_clientes
                SET nombre_cliente = ?, apellido_cliente = ?, correo_electronico_cliente = ?, direccion_cliente = ?, id_empresa = ?, numero_telefono_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->direccion, $this->id_empresa, $this->telefono, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_cliente
            FROM tb_clientes
            WHERE correo_electronico_cliente = ?';

        $params = array($value);

        if ($this->id !== null) {
            $sql .= ' AND id_cliente <> ?';
            $params[] = $this->id;
        }

        return Database::getRow($sql, $params);
    }
    public function clientesPorEmpresa()
    {
        $sql = 'SELECT e.nombre_empresa AS empresa, COUNT(c.id_cliente) AS total_clientes
                FROM tb_clientes c
                JOIN tb_empresas e ON c.id_empresa = e.id_empresa
                GROUP BY e.id_empresa;
                ';
        return Database::getRows($sql);
    }
    /*Reportes predictivos */

    /*
    *   Método para calcular el Valor del Ciclo de Vida del Cliente (CLV).
    */
    public function graficoDistrubcionCliente()
    {
        $sql = 'SELECT d.medio_envio, COUNT(d.id_detalle_envio) AS total_envios
                FROM tb_detalle_envios d
                JOIN tb_envios e ON d.id_envio = e.id_envio
                WHERE e.id_cliente = ?  
                GROUP BY d.medio_envio;';
        $params = array($this->id);
        return Database::getRows($sql, $params); 
    }
    

    public function clientesRegistradosXmes()
    {
        $sql = 'SELECT MONTH(fecha_registro_cliente) AS mes, COUNT(id_cliente) AS nuevos_clientes
                FROM tb_clientes
                WHERE YEAR(fecha_registro_cliente) = YEAR(CURDATE())  
                GROUP BY MONTH(fecha_registro_cliente);

        ';
        return Database::getRows($sql);
    }

    public function calcularCLV($id_cliente)
    {
        // Obtener el total de compras del cliente.
        $sql = 'SELECT SUM(tde.costo_envio + tde.impuesto_envio) AS total_compras, COUNT(te.id_envio) AS total_pedidos
                FROM tb_envios te
                JOIN tb_detalle_envios tde ON te.id_envio = tde.id_envio
                JOIN tb_clientes c ON te.id_cliente = c.id_cliente
                WHERE c.id_cliente = ? AND (te.estado_envio = "Finalizado" OR te.estado_envio = "Entregado")';
        $params = array($id_cliente);
        $data = Database::getRow($sql, $params);

        if ($data) {
            $total_compras = $data['total_compras'];
            $total_pedidos = $data['total_pedidos'];

            // Si no hay compras registradas, devolver 0.
            if ($total_pedidos == 0) {
                return 0;
            }

            // Calcular el CLV básico.
            // Promedio de compra por pedido.
            $clv = $total_compras / $total_pedidos;

            // Puedes agregar factores adicionales al CLV, como frecuencia de compra, tasa de retención, etc.
            return $clv;
        } else {
            return 0; // Si no se encontraron registros, el CLV es 0.
        }
    }

    /*
    *   Método para obtener un reporte de CLV por cliente.
    */
    public function obtenerReporteCLV()
    {
        $sql = 'SELECT c.id_cliente, c.nombre_cliente, c.apellido_cliente, c.correo_electronico_cliente
                FROM tb_clientes c
                JOIN tb_envios te ON c.id_cliente = te.id_cliente
                WHERE te.estado_envio = "Finalizado" OR te.estado_envio = "Entregado"
                GROUP BY c.id_cliente, c.nombre_cliente, c.apellido_cliente, c.correo_electronico_cliente
                ORDER BY c.nombre_cliente';
        $clientes = Database::getRows($sql);

        $reporte = [];

        foreach ($clientes as $cliente) {
            $clv = $this->calcularCLV($cliente['id_cliente']);
            $reporte[] = [
                'nombre' => $cliente['nombre_cliente'] . ' ' . $cliente['apellido_cliente'],
                'correo' => $cliente['correo_electronico_cliente'],
                'clv' => $clv
            ];
        }

        return $reporte;
    }

    public function clientesXempresa()
    {
        $sql = 'SELECT 
    c.id_cliente,
    c.nombre_cliente,
    c.apellido_cliente,
    c.correo_electronico_cliente,
    c.numero_telefono_cliente,
    c.fecha_registro_cliente,
    e.nombre_empresa
FROM 
    tb_clientes c
JOIN 
    tb_empresas e ON c.id_empresa = e.id_empresa
WHERE 
    e.id_empresa = ?; 
    ';
    $params = array($this->id_empresa);
    return Database::getRows($sql, $params); 
    }
}
