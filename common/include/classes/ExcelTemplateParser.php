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
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"]);
}
if(!defined("TEST_DIR")) {
        define("TEST_DIR", SYSTEM_ROOT . DIRECTORY_SEPARATOR . "common/include/classes/");
}
if(!defined("LIB_DIR")) {
        define("LIB_DIR", SYSTEM_ROOT . DIRECTORY_SEPARATOR . "common/include/lib/");
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
                require_once(LIB_DIR . "PHPExcel/Classes/PHPExcel.php");
                require_once(LIB_DIR . "PHPExcel/Classes/PHPExcel/IOFactory.php");

                $this->setPEoptions($options);

                if (!file_exists($file)) {
                        throw new Exception("The file\"" . $file . "\" doesn't exists" . EOL);
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
                        throw new Exception("Given options are not an array");
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

        private function adjustColumn($c){
                if(is_numeric($c)) {
                        $c = intval($c);
                        $letter = "";
                        if ($c <= 0) { return ""; };

                        while($c !== 0) {
                                $p = ($c - 1) % 26;
                                $c = intval(($c - $p) / 26);
                                $letter = chr(65 + $p) . $letter;
                        }
                } else if(is_string($c)) {
                        $letter = PHPExcel_Cell::columnIndexFromString($c);
                }
                return $letter;
        }

        private function array_filtering($val) {
                $val = trim($val);
                $allowed_vals = array("0"); // Add here your valid values
                return in_array($val, $allowed_vals, true) ? true : ( $val ? true : false );
        }

        private function show_type($item) {
                return (is_null($item) ? "null" : (is_array($item) ? "array()" : $item));
        }

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
                                        $sheets[$i]["last_column_index"] = $this->adjustColumn($sheet->getHighestColumn());
                                        $sheets[$i]["columns_count"] = ord($sheet->getHighestColumn()) - 64;
                                } else {
                                        if($sheet->getTitle() == $worksheet) {
                                                $sheets["title"] = $sheet->getTitle();
                                                $sheets["last_row"] = $sheet->getHighestRow();
                                                $sheets["last_column"] = $sheet->getHighestColumn();
                                                $sheets["last_column_index"] = $this->adjustColumn($sheet->getHighestColumn());
                                                $sheets["columns_count"] = ord($sheet->getHighestColumn()) - 64;
                                        }
                                }
                        }
                        $i++;
                }
                // $sheets["sheets_count"] = count($sheets);

                return $sheets;
        } // getWorksheets

        /**
         * Get max row and col of specified worksheet
         * @param string                                $theWorksheet           The selected worksheet
         * @param intval                                $theRow                 Last row number
         * @param string                                $theCol                 Last column name
         */
        public function getMax($theWorksheet, &$theRow, &$theCol, &$theCols) {
                $sheet = $this->getWorksheets($theWorksheet);
                $theRow = $sheet["last_row"];
                $theCol = $sheet["last_column"];
                $theCols = $sheet["last_column_index"];
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
                        throw new Exception("Bad array mixing in \"\$theRow\": \"" . $this->show_type($theRow) . "\"");
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
                $cell_iterator->setIterateOnlyExistingCells(true);

                return $cell_iterator;
        } // getCellIterator

        /**
         * Calculate the columns offset
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  int                                  $theRow                 The row coordinate
         * @param  int                                  $theCol                 The col coordinate
         * @return array                                $cols                   The array with cells results
         */
        private function offsetCols($theWorksheet, $theRow, $theCol) {
                $theOriginalCol = $theCol[0];
                if(count($theCol) == 0) {
                        throw new Exception("A zero offset value is not allowed for \"\$theCol\": " . $this->show_type($theRow) . "\"");
                } else if(count($theCol) == 1) {
                        throw new Exception("Only one value was passed for \"\$theCol\": " . $this->show_type($theRow) . "\"");
                } else if(count($theCol) > 2) {
                        throw new Exception("Too much values was passed for \"\$theCol\": " . $this->show_type($theRow) . "\"");
                } else {
                        $theCol[0] = (is_string($theCol[0]) ? $this->adjustColumn($theCol[0]) : $theCol[0]);
                        if($theCol[0] <= 0) {
                                throw new Exception("A zero offset value is not allowed for \"\$theCol\": " . $this->show_type($theCol) . "\"");
                        } else {
                                $offset = $theCol[0];
                        }
                        if($theCol[1] <= 0) {
                                throw new Exception("A zero offset value is not allowed for \"\$theCol\": " . $this->show_type($theCol) . "\"");
                        } else {
                                $max_col = $theCol[1];
                        }
                        // Calculate the offset
                        for($col = $offset; $col < ($offset + $max_col); $col++) {
                                $cell = $this->getCell($theWorksheet, $theRow, $this->adjustColumn($col));
                                if(is_object($this->getCellValue($theWorksheet, $theRow, $this->adjustColumn($col)))) {
                                        $cell_value = $cell->__toString();
                                } else {
                                        $cell_value = $cell->getValue();
                                }
                                $cols[(is_string($theOriginalCol) ? $this->adjustColumn($col) : $col)] = $cell_value;
                        }
                }
                return $cols;
        }

        /**
         * Calculate the rows offset
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  int                                  $theRow                 The row coordinate
         * @param  int                                  $theCol                 The col coordinate
         * @return array                                $cols                   The array with cells results
         */
        private function offsetRows($theWorksheet, $theRow, $theCol) {
                $theOriginalRow = $theRow[0];
                $rows = array();
                if(count($theRow) == 0) {
                        throw new Exception("A zero offset value is not allowed for \"\$theRow\": " . $this->show_type($theRow) . "\"");
                } else if(count($theRow) == 1) {
                        throw new Exception("Only one value was passed for \"\$theRow\": " . $this->show_type($theRow) . "\"");
                } else if(count($theRow) > 2) {
                        throw new Exception("Too much values was passed for \"\$thetheRowCol\": " . $this->show_type($theRow) . "\"");
                } else {
                        $theRow[0] = intval($theRow[0]);
                        if($theRow[0] <= 0) {
                                throw new Exception("A zero offset value is not allowed for \"\$theCol\"" . $this->show_type($theRow) . "\"");
                        } else {
                                $offset = $theRow[0];
                        }
                        if($theRow[1] <= 0) {
                                throw new Exception("A zero offset value is not allowed for \"\$theCol\"" . $this->show_type($theRow) . "\"");
                        } else {
                                $max_row = $theRow[1];
                        }
                        // Calculate the offset
                        for($row = $offset; $row < ($offset + $max_row); $row++) {
                                $cell = $this->getCell($theWorksheet, $row, $theCol);
                                if(is_object($this->getCellValue($theWorksheet, $row, $theCol))) {
                                        $cell_value = $cell->__toString();
                                } else {
                                        $cell_value = $cell->getValue();
                                }
                                $rows[$row] = $cell_value;
                        }
                }
                return $rows;
        }

        /**
         * Get an array of values for a given rows
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  void                                 $theCol                 The number or the name of the column in which limit the results.
         *                                                                      If null or zero will display all columns
         * @param  void                                 $theRow                 The rows coordinate.
         *                                                                      If null will display all columns.
         *                                                                      If integer (> 0) will display selected row.
         *                                                                      If array you need to pass the offset for the first value and the limit for the second one.
         * @return array                                                        The cell value
         */
        public function getRows($theWorksheet, $theRow = null, $theCol) {
                $rows = array();

                if(is_string($theRow)) {
                        $theOriginalRow = $theRow;
                        $theRow = intval($theRow);
                        if($theRow === 0) {
                                if(is_string($theOriginalRow)) {
                                        throw new Exception("Bad value (string) for \"\$theRow\": \"" . $this->show_type($theRow) . "\"");
                                } else {
                                        throw new Exception("A zero offset value is not allowed for \"\$theRow\"" . $this->show_type($theRow) . "\"");
                                }
                        }
                }
                if(is_null($theCol)) {
                        $rows = array();
                        $last_column = $this->getWorksheets($theWorksheet)["last_column"];
                        $last_row = $this->getWorksheets($theWorksheet)["last_row"];
                        $last_column++;

                        for($column = "A"; $column < $last_column; $column++) {
                                $rows[$column] = current($this->getRows($theWorksheet, $theRow, $column));
                        }
                } else if(!is_numeric($theRow)) {
                        throw new Exception("A non-numeric value was passed for \"\$theRow\": \"" . $this->show_type($theRow) . "\"");
                } else {
                        $theOriginalRow = $theRow;
                        $theRow = intval($theRow);
                        if($theRow === 0) {
                                if(is_string($theOriginalRow)) {
                                        throw new Exception("Bad value (string) for \"\$theRow\": \"" . $this->show_type($theRow) . "\"");
                                } else {
                                        throw new Exception("A zero offset value is not allowed for \"\$theRow\"" . $this->show_type($theRow) . "\"");
                                }
                        }

                        $i = 0;
                        foreach($this->getCellIterator($theWorksheet, $theRow) as $cell) {
                                if(is_numeric($theCol)) {
                                        if(intval($theCol) == 0) {
                                                throw new Exception("Bad value for \"\$theCol\": \"" . $this->show_type($theCol) . "\"");
                                        }
                                        $theCol = $this->adjustColumn($theCol);
                                }
                                if(is_array($theCol)) {
                                        $rows = $this->offsetCols($theWorksheet, $theRow, $theCol);
                                }
                                if(is_null($theCol) || is_string($theCol) || $theCol === 0) {
                                        if(is_string($theCol) && $theCol == $cell->getColumn()) {
                                                if(is_object($cell->getValue())) {
                                                        $cell_value = $cell->__toString();
                                                } else {
                                                        $cell_value = $cell->getValue();
                                                }

                                                $rows[$theCol] = $cell_value;
                                                break;
                                        } else if(is_null($theCol)) {
                                                $rows = array();
                                                $last_column = $this->getWorksheets($theWorksheet)["last_column"];
                                                $last_row = $this->getWorksheets($theWorksheet)["last_row"];
                                                $last_column++;

                                                for($column = "A"; $column < $last_column; $column++) {
                                                        $rows[$column] = current($this->getRows($theWorksheet, $theRow, $column));
                                                }
                                                break;
                                        // } else {
                                        //
                                        }
                                }
                                $i++;
                        }
                }
                return array_filter($rows, array($this, "array_filtering"));

        } // getRows

        /**
         * Get an array of values for a given columns
         * @param  string                               $theWorksheet           The selected worksheet
         * @param  void                                 $theRow                 The number of the row in which limit the results.
         *                                                                      If null or 0 will display all rows
         *                                                                      If array you need to pass the offset for the first value and the limit for the second one.
         * @param  void                                 $theCol                 The column coordinate
         *
         * @return array                                                        The cell value
         */
        public function getCols($theWorksheet, $theRow = null, $theCol) {
                $cols = array();

                if(is_numeric($theCol)) {
                        $theCol = $this->adjustColumn($theCol);
                }
                if(is_null($theCol)) {
                        throw new Exception("Bad value (null) for \"\$theCol\": \"" . $this->show_type($theCol) . "\"");
                } else if(is_array($theCol)) {
                        throw new Exception("A non-numeric value was passed for \"\$theCol\": \"" . $this->show_type($theRow) . "\"");
                } else {
                        $theOriginalCol = $theCol;
                        $last_column = $this->getWorksheets($theWorksheet)["last_column"];
                        $last_row = $this->getWorksheets($theWorksheet)["last_row"];
                        $last_column++;

                        if(is_null($theRow)) {
                                $cols = array();
                                $last_column = $this->getWorksheets($theWorksheet)["last_column"];
                                $last_row = $this->getWorksheets($theWorksheet)["last_row"];
                                $last_column++;

                                for($row = 1; $row <= $last_row; $row++) {
                                        $cols[$row] = current($this->getCols($theWorksheet, $row, $theCol));
                                }
                        } else if(is_array($theRow)){
                                $cols = $this->offsetRows($theWorksheet, $theRow, $theCol);
                        } else {
                                // throw new Exception("An invalid value was passed for \"\$theRow\": \"" . $this->show_type($theRow) . "\"");
                                $cols = $this->getCellValue($theWorksheet, $theRow, $theCol);
                        }
                }

                return $cols;
        } // getCols
}

/* -------------------------------------------------------------------------- */

// Usage
$parser = new ExcelTemplateParser(TEST_DIR . "CWR_Checklist_Template.xlsx");

/**
 * Get document properties
 *
 * If you pass false or null return an array with worksheets names
 * If you pass true return an array with all worksheets data
 * If you pass a string with the worksheet name return all data for the given worksheet
 *
 */
// $document_properties = $parser->getDocumentProperties();
// print_r($document_properties);

/**
 * Get document custom properties
 */
// $document_custom_properties = $parser->getDocumentCustomProperties();
// print_r($document_custom_properties);

/**
 * Ged document PID
 */
// $PID = $parser->getPID();
// print_r($PID);

/**
 * Get all worksheets
 */
// $worksheets = $parser->getWorksheets();
// print_r($worksheets);

/**
 * Get Max values
 */
// $parser->getMax("CK_Identification", $row, $col, $cols);
// print "Row: " . $row . "\n";
// print "Col: " . $col . "\n";
// print "Cols: " . $cols . "\n";

/**
 * Get specific cell value
 */
// print_r($parser->getCellValue("CK_Threats", 2, "C"));

/**
 * Get specific row value
 * You can pass an array of rows
 */
// print_r($parser->getRows("CK_Identification", 1, "A"));
// or
// print_r($parser->getRows("CK_Identification", array(2, 5, 8), "D"));

/**
 * Get specific columns value
 * You can pass an array of rows
 */
// print_r($parser->getCols("List code and descriptions", 8, "C"));
// or


print "GETCOLS\n";
print "Give me the first three rows of column \"B\"\n" . str_repeat("-", 50) . "\n";
print_r($parser->getCols("List code and descriptions", array(1, 3), "B"));
print_r($parser->getCols("List code and descriptions", 3, "C"));

print "\n\n\n";

print "GETROWS\n";
print "Give me the first three columns of row 1\n" . str_repeat("-", 50) . "\n";
print_r($parser->getRows("List code and descriptions", 1, array("A", 3)));

?>
