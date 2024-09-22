<?php
require_once('../../libraries/fpdf185/fpdf.php');
require_once('../../models/handler/usuario_handler.php'); // Asegúrate de incluir el archivo que contiene UsuarioHandler

class Report extends FPDF
{
    const CLIENT_URL = 'http://localhost/pemiparts/vistas/';
    private $title = null;

    public function startReport($title)
    {
        session_start();
        if (isset($_SESSION['idUsuario'])) {
            $this->title = $title;
            $this->setTitle('pemiparts - Reporte', true);
     
            $this->setMargins(15, 15, 15);
            $this->addPage('p', 'letter');
            $this->aliasNbPages();
        } else {
            header('location:' . self::CLIENT_URL);
        }
    }

    public function encodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    public function header()
    {
        // Fondo del encabezado con gradiente (simulado con rectángulos superpuestos)
        $this->setFillColor(0, 51, 153); // Azul 
        $this->rect(0, 0, 220, 20, 'F');
        $this->setFillColor(0, 76, 204); // Azul claro
        $this->rect(0, 20, 220, 20, 'F');

        // Coloco la imagen del logo encima del fondo
        $this->image('../../images/logo.png', 15, 10, 35);
        
        // Título del reporte en blanco, centrado
        $this->setFont('Arial', 'B', 18);
        $this->setTextColor(255, 255, 255); // Texto blanco
        $this->cell(0, 10, $this->encodeString($this->title), 0, 1, 'C');
        
        // Fecha y hora centradas
        $this->setFont('Arial', '', 13);
        $this->cell(0, 10, 'Fecha/Hora: ' . date('d-m-Y H:i:s'), 0, 1, 'C');
        $this->ln(15);
    }

    public function footer()
    {
        // Fondo azul para el pie
        $this->setY(-25);
        $this->setFillColor(0, 51, 163); // Azul 
        $this->rect(0, $this->getY(), 220, 25, 'F');
        
        // Número de página
        $this->setFont('Arial', 'I', 8);
        $this->setTextColor(255, 255, 255); // Texto blanco en el pie
        $this->cell(0, 10, 'Pagina ' . $this->pageNo() . '/{nb}', 0, 0, 'C');

        // Mostrar nombre de usuario en lugar de correo
        $usuarioHandler = new UsuarioHandler();
        $userName = $usuarioHandler->getUserNameById($_SESSION['idUsuario']);
        if ($userName) {
            $this->cell(0, 10, 'Descargado por: ' . $this->encodeString($userName), 0, 0, 'R');
        } else {
            $this->cell(0, 10, 'Descargado por: Usuario desconocido', 0, 0, 'R');
        }
    }

    public function addTableHeader($headers)
    {
        // Colores del encabezado de la tabla (Azul )
        $this->setFillColor(0, 51, 153); // Azul 
        $this->setTextColor(255, 255, 255); // Texto blanco
        
        $this->setFont('Arial', 'B', 12);
        foreach ($headers as $header) {
            $this->cell(40, 10, $this->encodeString($header), 1, 0, 'C', true);
        }
        $this->ln();
    }

    public function addTableRow($row)
    {   
        // Filas con colores alternos
        static $fill = false;
        $this->setFillColor(66, 165, 245); // Gris claro
        $this->setTextColor(0); // Negro para texto

        $this->setFont('Arial', '', 10);
        foreach ($row as $column) {
            $this->cell(40, 10, $this->encodeString($column), 1, 0, 'C', $fill);
        }
        $this->ln();
        $fill = !$fill; // Alternar color
    }
}
