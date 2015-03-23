<?php
/**
* ExcelTemplateParser.php
*
* This file contains the {@link ExcelTemplateParser} class.
*
* @const SYSTEM_ROOT           The System root dir
* @const INCLUDE_DIR           Include dir
* @const CLASSES_DIR           Classes dir
* @const CONF_DIR              Conf dir
*/

header("Content-type: text/plain; charset=utf-8;");
date_default_timezone_set("Europe/Rome");

// Commented for local testing
// namespace OntologyWrapper;
if(!defined("SYSTEM_ROOT")) {
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("TEST_DIR")) {
        define("TEST_DIR", SYSTEM_ROOT . DIRECTORY_SEPARATOR . "common/include/classes/");
}
define("EOL", (PHP_SAPI == "cli") ? PHP_EOL : "\n");

/*=======================================================================================
*																						*
*										ExcelTemplateParser.php										*
*																						*
*======================================================================================*/


/**
* Excel parser object
*
* This class can be used to extract data from an excel file
* keys.
*
* The class features the following methods:
*
*
*	@author		Alessandro Gubitosi <gubi.ale@iod.io>
*	@version	1.00 19/02/2014
*/
class ExcelTemplateParser {
        /*===================================================================================
        *	__construct																		*
        *==================================================================================*/

        /**
        * Instantiate class.
        *
        * @param string					$file			The Excel file name (including its path)
        * @param array                                  $options                An array with PHPExcel options
        *
        * @access public
        *
        * @uses cypherMode()
        * @uses keySize()
        */
        public function __construct($file, $options = null) {
                // Include PHPExcel data class
                require_once(TEST_DIR . "PHPExcel.php");
                require_once(TEST_DIR . "PHPExcel/IOFactory.php");

                $this->setPEoptions($options);

                if (!file_exists($file)) {
                        exit("ERROR: The file\"" . $file . "\" doesn't exists" . EOL);
                }

                $start_time = $this->getTime();
                // Create new PHPExcel object
                $this->PE = PHPExcel_IOFactory::load($file);
                $end_time = $this->getTime();

                $this->load_file_stats = $this->timeStats($start_time, $end_time);
        } // Constructor

        /**
         * Get the time for time stats
         * @return float                                                        Current microtime
         */
        private function getTime() { return microtime(true); }

        /**
         * Calculate time stats
         * @param  float                                $start_time             The init time
         * @param  float                                $end_time               The end time
         * @return float                                                        The stat time
         */
        private function timeStats($start_time, $end_time) { return $start_time - $end_time; }

        /**
         * Get current memory usage
         */
        private function getMemoryUsage() { return (memory_get_usage(true)/1024/1024) . "Mb"; }

        /**
         * Get peak memory usage
         */
        private function getPeakMemoryUsage() { return (memory_get_peak_usage(true)/1024/1024) . "Mb"; }

        /**
         * Set the class options
         * if no options was passed this function loads default data
         *
         * Default options:
         * * cache_method:      PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp
         * * cache_size:        "20MB"
         * * excel_version:     "Excel2007"
         * * read_only_file_data:    false
         *
         * @param array                                 $options                An array with class general options
         */
        private function setPEoptions($options) {
                if(!is_null($options) && !is_array($options)) {
                        exit("ERROR: Given options are not an array" . EOL);
                }

                /**
                 * Cache method
                 * @see PHPExcel::CachedObjectStorageFactory.php                The original script with available params
                 * @see http://git.io/AmVU                                      Memory compsunption stats
                 * @var object                          $cache_method           The method of the PhpExcel cache. Default is PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp
                 */
                $cache_method = (isset($options["cache_method"]) ? $options["cache_method"] : PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp);

                /**
                 * Cache size (in Mb)
                 * @var array                           $cache_size
                 */
                $cache_size = array("memoryCacheSize" => "20MB");
                if(isset($options["cache_size"])) {
                        // Check and correct the passed value
                        $cache_size = array("memoryCacheSize" => (is_numeric($options["cache_size"]) ? $options["cache_size"] . "MB" : (int) preg_replace('/[^0-9]/', "", $options["cache_size"]) . "MB"));
                }

                /**
                 * Excel version
                 * @var string                          $excel_version          A string with the excel version to parse
                 */
                $excel_version = (isset($options["excel_version"]) ? $options["excel_version"] : "Excel2007");

                /**
                 * Read only data?
                 * @var bool                            $read_only_file_data              Read only document data without its properties
                 */
                $read_only_file_data = (isset($options["read_only_file_data"]) ? $options["read_only_file_data"] : false);

                /**
                 * Create new PHPExcel object
                 * @var $this->PE
                 */
                PHPExcel_Settings::setCacheStorageMethod($cache_method, $cache_size);
                $this->PE = PHPExcel_IOFactory::createReader($excel_version);
                $this->PE->setReadDataOnly($read_only_file_data);
        } // setPEoptions

        /**
         * Transform PhpExcel object in array
         * @param  object                               $obj                    The PhpExcel object
         * @return array                                                        The object transformed to array
         */
        private function toArray($obj) {
                $objArr = substr(str_replace(get_class($obj) . "::__set_state(", "", var_export($obj, true)), 0, -1);
                eval("\$values = $objArr;");
                return $values;
        } //toArray

        /**
         * Get document properties
         * @return array                                                        An array with all document properties
         */
        public function getDocumentProperties() { return $document_properties = $this->toArray($this->PE->getProperties()); }

        /**
         * Get document custom properties
         * @return array                                                        An array with all document custom properties
         */
        public function getDocumentCustomProperties() { return $document_custom_properties = $this->getDocumentProperties()["_customProperties"]; }

        /**
         * Get the document PID custom property
         * @return string                                                       The PID
         */
        public function getPID() { return $this->getDocumentCustomProperties()["PID"]["value"]; }


        /**
         * Get all workseets
         *
         * @param  void                                 $worksheet              If null or false return only the title of all worksheets
         *                                                                      If true return all sheets data
         *                                                                      If string of a worksheet name is passed return all data of a specific worksheet name
         * @return array                                                        An array with all worksheets data
         */
        public function getWorksheets($worksheet = null) {
                $sheets = array();
                $i = 0;
                foreach($this->PE->getWorksheetIterator() as $sheet) {
                        if(is_null($worksheet) || is_bool($worksheet) && $worksheet === false) {
                                $sheets[$i] = $sheet->getTitle();
                        } else {
                                if(is_bool($worksheet) && $worksheet === true) {
                                        $sheets[$i]["title"] = $sheet->getTitle();
                                        $sheets[$i]["last_row"] = $sheet->getHighestRow();
                                        $sheets[$i]["last_column"] = $sheet->getHighestColumn();
                                        $sheets[$i]["last_column_index"] = PHPExcel_Cell::columnIndexFromString($sheet->getHighestColumn());
                                        $sheets[$i]["columns_count"] = ord($sheet->getHighestColumn()) - 64;
                                } else {
                                        if($sheet->getTitle() == $worksheet) {
                                                $sheets["title"] = $sheet->getTitle();
                                                $sheets["last_row"] = $sheet->getHighestRow();
                                                $sheets["last_column"] = $sheet->getHighestColumn();
                                                $sheets["last_column_index"] = PHPExcel_Cell::columnIndexFromString($sheet->getHighestColumn());
                                                $sheets["columns_count"] = ord($sheet->getHighestColumn()) - 64;
                                        }
                                }
                        }
                        $i++;
                }
                $sheets["sheets_count"] = count($sheets);

                return $sheets;
        } // getWorksheets

        /**
         * Get max row and col of specified worksheet
         * @param string                                $theWorksheet           The selected worksheet
         * @param intval                                $theRow                 Last row number
         * @param string                                $theCol                 Last column name
         */
        public function getMax($theWorksheet, &$theRow, &$theCol) {
                $sheet = $this->getWorksheets($theWorksheet);
                $theRow = $sheet["last_row"];
                $theCol = $sheet["last_column"];
        } // getMax

        /**
         * Get a single cell object
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  int                                  $theRow                 The row coordinate
         * @param  int                                  $theCol                 The col coordinate
         * @return string                                                       The cell value
         */
        public function getCell($theWorksheet, $theRow, $theCol) {
                return $this->PE->getSheetByName($theWorksheet)->getCell($theCol . $theRow);
        } // getCell

        /**
         * Get a single cell data
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  int                                  $theRow                 The row coordinate
         * @param  int                                  $theCol                 The col coordinate
         * @return string                                                       The cell value
         */
        public function getCellValue($theWorksheet, $theRow, $theCol) {
                if(is_array($theRow) && is_array($theCol)) {
                        exit("ERROR: You cannot mix columns and rows" . EOL);
                }
                if(is_array($theRow)) {
                        if(count($theRow) == 1) {
                                $cell = $this->getCell($theWorksheet, $theRow[0], $theCol)->getValue();
                        } else {
                                foreach($theRow as $row) {
                                        $cell[$row] = $this->getCell($theWorksheet, $row, $theCol)->getValue();
                                }
                        }
                } else if(is_array($theCol)) {
                        if(count($theCol) == 1) {
                                $cell = $this->getCell($theWorksheet, $theRow, $theCol[0])->getValue();
                        } else {
                                foreach($theCol as $col) {
                                        $cell[$col] = $this->getCell($theWorksheet, $theRow, $col)->getValue();
                                }
                        }
                } else {
                        $cell = $this->getCell($theWorksheet, $theRow, $theCol)->getValue();
                }

                return $cell;
        } // getCell

        /**
         * Get the PhpExcel row iterator object
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  int                                  $theRow                 The number of the row to parse
         * @return object                                                       The row iterator object
         */
        public function getWorksheetRow($theWorksheet, $theRow) {
                return $this->PE->getSheetByName($theWorksheet)->getRowIterator($theRow)->current();
        } // getWorksheetRow

        /**
         * Get the PhpExcel cell iterator object
         *
         * @return object                                                       The cell iterator object
         */
        public function getCellIterator($theWorksheet, $theRow) {
                $cell_iterator = $this->getWorksheetRow($theWorksheet, $theRow)->getCellIterator();
                $cell_iterator->setIterateOnlyExistingCells(false);

                return $cell_iterator;
        } // getCellIterator

        /**
         * Get an array of values for a given rows
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  void                                 $theRow                 The rows coordinate
         * @param  void                                 $theCol                 The number or the name of the column in which limit the results.
         *                                                                      If null or 0 will display all columns
         * @return array                                                        The cell value
         */
        public function getRows($theWorksheet, $theRow, $theCol = null) {
                if(is_array($theCol)) {
                        exit("ERROR: You cannot mix columns in rows" . EOL);
                }
                if(is_array($theRow)) {
                        if(count($theRow) == 1) {
                                $rows = $this->getRows($theWorksheet, $theRow[0], $theCol);
                        } else {
                                foreach($theRow as $row) {
                                        $rows[$row] = $this->getRows($theWorksheet, $row, $theCol);
                                }
                        }
                } else {
                        $i = 0;
                        $rows = array();
                        foreach($this->getCellIterator($theWorksheet, $theRow) as $cell) {
                                if(is_null($theCol) || is_string($theCol) || $theCol == 0) {
                                        $rows[$cell->getColumn()] = $cell->getValue();

                                        if(is_string($theCol) && $theCol == $cell->getColumn()) {
                                                break;
                                        }
                                } else if(is_numeric($theCol) && $i < $theCol) {
                                        if(is_object($cell->getValue())) {
                                                $cell_value = $cell->__toString();
                                        } else {
                                                $cell_value = $cell->getValue();
                                        }
                                        $rows[$cell->getColumn()] = $cell_value;
                                }
                                $i++;
                        }
                }
                return $rows;
        } // getRows

        /**
         * Get an array of values for a given columns
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  void                                 $theRow                 The number of the row in which limit the results.
         *                                                                      If null or 0 will display all rows
         * @param  void                                 $theCol                 The column coordinate
         *
         * @return array                                                        The cell value
         */
        public function getCols($theWorksheet, $theRow = null, $theCol = "A") {
                if(is_array($theRow)) {
                        exit("ERROR: You cannot mix rows in columns" . EOL);
                }
                if(is_array($theCol)) {
                        if(count($theCol) == 1) {
                                $cols = $this->getCols($theWorksheet, $theRow, $theCol[0]);
                        } else {
                                foreach($theCol as $col) {
                                        $cols[$col] = $this->getCols($theWorksheet, $theRow, $col);
                                }
                        }
                } else {
                        $last_column = $this->getWorksheets($theWorksheet)["last_column"];
                        $last_row = $this->getWorksheets($theWorksheet)["last_row"];
                        $last_column++;
                        if(is_numeric($theCol)) {
                                $col = 0;
                                for($column = "A"; $column != $last_column; $column++) {
                                        $col++;
                                        if($col == $theCol) {
                                                $theCol = $column;
                                        }
                                }
                        }
                        if(is_null($theRow) || $theRow == 0) {
                                $theRow = $last_row;
                        }
                        for($row = 1; $row < ($theRow + 1); $row++) {
                                $cell = $this->getCell($theWorksheet, $row, $theCol);
                                if(is_object($this->getCellValue($theWorksheet, $row, $theCol))) {
                                        $cell_value = $cell->__toString();
                                } else {
                                        $cell_value = $cell->getValue();
                                }
                                $cols[$row] = $cell_value;

                        }
                }
                return $cols;
        } // getCols
}

/* -------------------------------------------------------------------------- */

// Usage
// $parser = new ExcelTemplateParser("CWR_Checklist_Template.xlsx");

/**
 * Get document properties
 *
 * If you pass false or null return an array with worksheets names
 * If you pass true return an array with all worksheets data
 * If you pass a string with the worksheet name return all data for the given worksheet
 *
 */
// $document_properties = $parser->getDocumentProperties();

/**
 * Get document custom properties
 */
// $document_custom_properties = $parser->getDocumentCustomProperties();

/**
 * Ged document PID
 */
// $PID = $parser->getPID();

/**
 * Get all worksheets
 */
// $worksheets = $parser->getWorksheets();

/**
 * Get Max values
 */
// $parser->getMax("List code and descriptions", $row, $col);
// print "Row: " . $row . "\n";
// print "Col: " . $col . "\n";

/**
 * Get specific cell value
 */
// print_r($parser->getCellValue("CK_Threats", array(4, 2), array("C")));

/**
 * Get specific row value
 * You can pass an array of rows
 */
// print_r($parser->getRows("CK_Identification", 4, "AI"));
// or
// print_r($parser->getRows("CK_Identification", array(2, 5, 8), "D"));

/**
 * Get specific columns value
 * You can pass an array of rows
 */
// print_r($parser->getCols("List code and descriptions", 8, "C"));
// or
// print_r($parser->getCols("List code and descriptions", 8, array("C", "E", "B", "A")));

?>
