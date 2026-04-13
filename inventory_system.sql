-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: inventory_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Administrator','Office') NOT NULL,
  `office_id` int DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `username` (`username`),
  KEY `office_id` (`office_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'main_admin','admin123','Administrator',NULL),(2,'sb_leg','password123','Office',1),(3,'sb_sec','password123','Office',2),(4,'dilg','password123','Office',3),(5,'liga','password123','Office',4),(6,'engineering','password123','Office',5),(7,'mpdo','password123','Office',6),(8,'icts','password123','Office',7),(9,'mayors','password123','Office',8),(10,'hrmo','password123','Office',9),(11,'budget','password123','Office',10),(12,'vice_mayors','password123','Office',11),(13,'supply','password123','Office',12),(14,'accounting','password123','Office',13),(15,'mcr','password123','Office',14),(16,'assessor','password123','Office',15),(17,'treasurer','password123','Office',16),(18,'bplo','password123','Office',17),(19,'waterworks','password123','Office',18),(20,'library','password123','Office',19),(21,'tourism','password123','Office',20),(22,'agriculture','password123','Office',21),(23,'mswdo','password123','Office',22),(24,'mdrrmo','password123','Office',23),(25,'admin_office','password123','Office',24);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `office_id` int DEFAULT NULL,
  `transaction_id` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `office_id` (`office_id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (108,13,71,'New Transaction: Filing Cabinet',1,'2026-04-13 03:01:46'),(109,24,71,'New Transaction: Filing Cabinet',1,'2026-04-13 03:01:46'),(110,7,71,'New Transaction: Filing Cabinet',1,'2026-04-13 03:01:47'),(111,13,71,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:02:56'),(112,24,71,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:02:56'),(113,7,71,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:02:56'),(114,13,72,'New Transaction: Filing Cabinet',1,'2026-04-13 03:04:02'),(115,24,72,'New Transaction: Filing Cabinet',1,'2026-04-13 03:04:02'),(116,7,72,'New Transaction: Filing Cabinet',1,'2026-04-13 03:04:02'),(117,7,73,'New Transaction: Air Conditioner',1,'2026-04-13 03:13:06'),(118,24,73,'New Transaction: Air Conditioner',1,'2026-04-13 03:13:06'),(119,13,73,'New Transaction: Air Conditioner',1,'2026-04-13 03:13:06'),(120,13,72,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:13:12'),(121,24,72,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:13:12'),(122,7,72,'Asset Returned: Filing Cabinet',1,'2026-04-13 03:13:12'),(123,7,73,'Asset Returned: Air Conditioner',1,'2026-04-13 03:29:00'),(124,24,73,'Asset Returned: Air Conditioner',1,'2026-04-13 03:29:00'),(125,13,73,'Asset Returned: Air Conditioner',1,'2026-04-13 03:29:00'),(126,7,74,'New Transaction: Air Conditioner',1,'2026-04-13 03:29:59'),(127,24,74,'New Transaction: Air Conditioner',1,'2026-04-13 03:29:59'),(128,13,74,'New Transaction: Air Conditioner',1,'2026-04-13 03:29:59'),(129,7,74,'Asset Returned: Air Conditioner',1,'2026-04-13 03:34:42'),(130,24,74,'Asset Returned: Air Conditioner',1,'2026-04-13 03:34:43'),(131,13,74,'Asset Returned: Air Conditioner',1,'2026-04-13 03:34:43'),(132,8,75,'New Transaction: Air Conditioner',1,'2026-04-13 03:37:12'),(133,24,75,'New Transaction: Air Conditioner',1,'2026-04-13 03:37:12'),(134,24,75,'New Transaction: Air Conditioner',1,'2026-04-13 03:37:12'),(135,8,75,'Asset Returned: Air Conditioner',1,'2026-04-13 03:38:28'),(136,24,75,'Asset Returned: Air Conditioner',1,'2026-04-13 03:38:28'),(137,24,75,'Asset Returned: Air Conditioner',1,'2026-04-13 03:38:28'),(138,8,76,'New Transaction: Air Conditioner',1,'2026-04-13 03:42:04'),(139,24,76,'New Transaction: Air Conditioner',1,'2026-04-13 03:42:04'),(140,24,76,'New Transaction: Air Conditioner',1,'2026-04-13 03:42:04'),(141,8,76,'Asset Returned: Air Conditioner',1,'2026-04-13 04:09:17'),(142,24,76,'Asset Returned: Air Conditioner',1,'2026-04-13 04:09:17'),(143,24,76,'Asset Returned: Air Conditioner',1,'2026-04-13 04:09:17'),(144,8,77,'New Transaction: Air Conditioner',1,'2026-04-13 05:00:04'),(145,24,77,'New Transaction: Air Conditioner',1,'2026-04-13 05:00:04'),(146,24,77,'New Transaction: Air Conditioner',1,'2026-04-13 05:00:04'),(147,8,77,'Asset Returned: Air Conditioner',1,'2026-04-13 05:07:02'),(148,24,77,'Asset Returned: Air Conditioner',1,'2026-04-13 05:07:02'),(149,24,77,'Asset Returned: Air Conditioner',1,'2026-04-13 05:07:02'),(150,7,78,'New Transaction: Epson L3210',1,'2026-04-13 06:17:57'),(151,24,78,'New Transaction: Epson L3210',0,'2026-04-13 06:17:57'),(152,13,78,'New Transaction: Epson L3210',1,'2026-04-13 06:17:57'),(153,7,78,'Asset Returned: Epson L3210',1,'2026-04-13 06:19:24'),(154,24,78,'Asset Returned: Epson L3210',0,'2026-04-13 06:19:24'),(155,13,78,'Asset Returned: Epson L3210',1,'2026-04-13 06:19:24'),(156,7,79,'New Transaction: Epson L3210',1,'2026-04-13 06:38:28'),(157,24,79,'New Transaction: Epson L3210',0,'2026-04-13 06:38:28'),(158,13,79,'New Transaction: Epson L3210',0,'2026-04-13 06:38:28'),(159,7,79,'Asset Returned: Epson L3210',1,'2026-04-13 06:40:50'),(160,24,79,'Asset Returned: Epson L3210',0,'2026-04-13 06:40:50'),(161,13,79,'Asset Returned: Epson L3210',0,'2026-04-13 06:40:51');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `office_id` int NOT NULL AUTO_INCREMENT,
  `office_name` varchar(100) NOT NULL,
  PRIMARY KEY (`office_id`),
  UNIQUE KEY `office_name` (`office_name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (13,'Accounting'),(24,'Admin'),(21,'Agriculture'),(15,'Assessor'),(17,'BPLO'),(10,'Budget'),(3,'DILG'),(5,'Engineering'),(9,'HRMO'),(7,'ICTS'),(19,'Library'),(4,'LIGA'),(8,'Mayor\'s'),(14,'MCR'),(23,'MDRRMO'),(6,'MPDO'),(22,'MSWDO'),(1,'SB Leg'),(2,'SB Sec'),(12,'Supply'),(20,'Tourism'),(16,'Treasurer'),(11,'Vice Mayor\'s'),(18,'Waterworks');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `product_type` varchar(100) NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `office_id` int DEFAULT NULL,
  `quality` varchar(50) DEFAULT 'New',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `serial_number_UNIQUE` (`serial_number`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (39,'ThinkPad Laptop','Electronics','Global Tech','SN-1000',1,13,'New'),(40,'Office Chair','Furniture','Office Works','SN-1001',1,24,'Good Condition'),(41,'Filing Cabinet','Furniture','Apex Supplies','SN-1002',1,21,'New'),(42,'HP LaserJet Printer','Electronics','Global Tech','SN-1003',1,15,'Good Condition'),(43,'System Unit (Dell)','Electronics','Office Works','SN-1004',1,17,'New'),(44,'Logitech Mouse','Electronics','Apex Supplies','SN-1005',1,10,'New'),(45,'Mechanical Keyboard','Electronics','Global Tech','SN-1006',1,3,'Good Condition'),(46,'Conference Table','Furniture','Office Works','SN-1007',1,5,'New'),(47,'Projector','Electronics','Apex Supplies','SN-1008',1,9,'Good Condition'),(48,'Air Conditioner','Appliance','Global Tech','SN-1009',1,7,'New'),(49,'ThinkPad Laptop','Electronics','Office Works','SN-1010',1,19,'Good Condition'),(50,'Office Chair','Furniture','Apex Supplies','SN-1011',1,4,'New'),(51,'Filing Cabinet','Furniture','Global Tech','SN-1012',1,8,'New'),(52,'HP LaserJet Printer','Electronics','Office Works','SN-1013',1,14,'Good Condition'),(53,'System Unit (Dell)','Electronics','Apex Supplies','SN-1014',1,23,'New'),(54,'Logitech Mouse','Electronics','Global Tech','SN-1015',1,6,'Good Condition'),(55,'Mechanical Keyboard','Electronics','Office Works','SN-1016',1,22,'New'),(56,'Conference Table','Furniture','Apex Supplies','SN-1017',1,1,'Good Condition'),(57,'Projector','Electronics','Global Tech','SN-1018',1,2,'New'),(58,'Air Conditioner','Appliance','Office Works','SN-1019',1,12,'Good Condition'),(59,'ThinkPad Laptop','Electronics','Apex Supplies','SN-1020',1,20,'New'),(60,'Office Chair','Furniture','Global Tech','SN-1021',1,16,'New'),(61,'Filing Cabinet','Furniture','Office Works','SN-1022',1,11,'Good Condition'),(62,'HP LaserJet Printer','Electronics','Apex Supplies','SN-1023',1,18,'New'),(63,'System Unit (Dell)','Electronics','Global Tech','SN-1024',1,13,'Good Condition'),(64,'Logitech Mouse','Electronics','Office Works','SN-1025',1,24,'New'),(65,'Mechanical Keyboard','Electronics','Apex Supplies','SN-1026',1,21,'Good Condition'),(66,'Conference Table','Furniture','Global Tech','SN-1027',1,15,'New'),(67,'Projector','Electronics','Office Works','SN-1028',1,17,'Good Condition'),(68,'Air Conditioner','Appliance','Apex Supplies','SN-1029',1,10,'New'),(69,'ThinkPad Laptop','Electronics','Global Tech','SN-1030',1,3,'New'),(70,'Office Chair','Furniture','Office Works','SN-1031',1,5,'Good Condition'),(71,'Filing Cabinet','Furniture','Apex Supplies','SN-1032',1,9,'New'),(72,'HP LaserJet Printer','Electronics','Global Tech','SN-1033',1,7,'Good Condition'),(73,'System Unit (Dell)','Electronics','Office Works','SN-1034',1,19,'New'),(74,'Logitech Mouse','Electronics','Apex Supplies','SN-1035',1,4,'Good Condition'),(75,'Mechanical Keyboard','Electronics','Global Tech','SN-1036',1,8,'New'),(76,'Conference Table','Furniture','Office Works','SN-1037',1,14,'New'),(77,'Projector','Electronics','Apex Supplies','SN-1038',1,23,'Good Condition'),(78,'Air Conditioner','Appliance','Global Tech','SN-1039',1,6,'New'),(79,'ThinkPad Laptop','Electronics','Office Works','SN-1040',1,22,'Good Condition'),(80,'Office Chair','Furniture','Apex Supplies','SN-1041',1,1,'New'),(81,'Filing Cabinet','Furniture','Global Tech','SN-1042',1,2,'Good Condition'),(82,'HP LaserJet Printer','Electronics','Office Works','SN-1043',1,12,'New'),(83,'System Unit (Dell)','Electronics','Apex Supplies','SN-1044',1,20,'New'),(84,'Logitech Mouse','Electronics','Global Tech','SN-1045',1,16,'Good Condition'),(85,'Mechanical Keyboard','Electronics','Office Works','SN-1046',1,11,'New'),(86,'Conference Table','Furniture','Apex Supplies','SN-1047',1,18,'Good Condition'),(87,'Projector','Electronics','Global Tech','SN-1048',1,13,'New'),(88,'Air Conditioner','Appliance','Office Works','SN-1049',1,24,'New'),(89,'ThinkPad Laptop','Electronics','Apex Supplies','SN-1050',1,21,'Good Condition'),(90,'Office Chair','Furniture','Global Tech','SN-1051',1,15,'New'),(91,'Filing Cabinet','Furniture','Office Works','SN-1052',1,17,'Good Condition'),(92,'HP LaserJet Printer','Electronics','Apex Supplies','SN-1053',1,10,'New'),(93,'System Unit (Dell)','Electronics','Global Tech','SN-1054',1,3,'New'),(94,'Logitech Mouse','Electronics','Office Works','SN-1055',1,5,'Good Condition'),(95,'Mechanical Keyboard','Electronics','Apex Supplies','SN-1056',1,9,'New'),(96,'Conference Table','Furniture','Global Tech','SN-1057',1,7,'Good Condition'),(97,'Projector','Electronics','Office Works','SN-1058',1,19,'New'),(98,'Air Conditioner','Appliance','Apex Supplies','SN-1059',1,4,'Good Condition'),(99,'ThinkPad Laptop','Electronics','Global Tech','SN-1060',1,8,'New'),(100,'Office Chair','Furniture','Office Works','SN-1061',1,14,'New'),(101,'Filing Cabinet','Furniture','Apex Supplies','SN-1062',1,23,'Good Condition'),(102,'HP LaserJet Printer','Electronics','Global Tech','SN-1063',1,6,'New'),(103,'System Unit (Dell)','Electronics','Office Works','SN-1064',1,22,'Good Condition'),(104,'Logitech Mouse','Electronics','Apex Supplies','SN-1065',1,1,'New'),(105,'Mechanical Keyboard','Electronics','Global Tech','SN-1066',1,2,'New'),(106,'Conference Table','Furniture','Office Works','SN-1067',1,12,'Good Condition'),(107,'Projector','Electronics','Apex Supplies','SN-1068',1,20,'New'),(108,'Air Conditioner','Appliance','Global Tech','SN-1069',1,16,'Good Condition'),(109,'ThinkPad Laptop','Electronics','Office Works','SN-1070',1,11,'New'),(110,'Office Chair','Furniture','Apex Supplies','SN-1071',1,18,'Good Condition'),(111,'Filing Cabinet','Furniture','Global Tech','SN-1072',1,13,'New'),(112,'HP LaserJet Printer','Electronics','Office Works','SN-1073',1,24,'New'),(113,'System Unit (Dell)','Electronics','Apex Supplies','SN-1074',1,21,'Good Condition'),(114,'Logitech Mouse','Electronics','Global Tech','SN-1075',1,15,'New'),(115,'Mechanical Keyboard','Electronics','Office Works','SN-1076',1,17,'Good Condition'),(116,'Conference Table','Furniture','Apex Supplies','SN-1077',1,10,'New'),(117,'Projector','Electronics','Global Tech','SN-1078',1,3,'Good Condition'),(118,'Air Conditioner','Appliance','Office Works','SN-1079',1,5,'New'),(119,'ThinkPad Laptop','Electronics','Apex Supplies','SN-1080',1,9,'New'),(120,'Office Chair','Furniture','Global Tech','SN-1081',1,7,'Good Condition'),(121,'Filing Cabinet','Furniture','Office Works','SN-1082',1,19,'New'),(122,'HP LaserJet Printer','Electronics','Apex Supplies','SN-1083',1,4,'Good Condition'),(123,'System Unit (Dell)','Electronics','Global Tech','SN-1084',1,8,'New'),(124,'Logitech Mouse','Electronics','Office Works','SN-1085',1,14,'New'),(125,'Mechanical Keyboard','Electronics','Apex Supplies','SN-1086',1,23,'Good Condition'),(126,'Conference Table','Furniture','Global Tech','SN-1087',1,6,'New'),(127,'Projector','Electronics','Office Works','SN-1088',1,22,'Good Condition'),(128,'Air Conditioner','Appliance','Apex Supplies','SN-1089',1,1,'New'),(129,'ThinkPad Laptop','Electronics','Global Tech','SN-1090',1,2,'Good Condition'),(130,'Office Chair','Furniture','Office Works','SN-1091',1,12,'New'),(131,'Filing Cabinet','Furniture','Apex Supplies','SN-1092',1,20,'New'),(132,'HP LaserJet Printer','Electronics','Global Tech','SN-1093',1,16,'Good Condition'),(133,'System Unit (Dell)','Electronics','Office Works','SN-1094',1,11,'New'),(134,'Logitech Mouse','Electronics','Apex Supplies','SN-1095',1,18,'Good Condition'),(135,'Mechanical Keyboard','Electronics','Global Tech','SN-1096',1,13,'New'),(136,'Conference Table','Furniture','Office Works','SN-1097',1,5,'New'),(137,'Projector','Electronics','Apex Supplies','SN-1098',1,7,'Good Condition'),(138,'Air Conditioner','Appliance','Global Tech','SN-1099',1,8,'New'),(140,'Epson L3210','electronics','System Default','SN-1100',1,7,'New');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(100) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Paula Lim','09703322984','Hardware','Boac','2026-03-12 04:55:21'),(2,'Mr. DIY','09123456789','Hardware','Boac','2026-03-16 06:26:41');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_type` varchar(100) NOT NULL,
  `product_model` varchar(100) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `office_id` int NOT NULL,
  `received_by` varchar(150) DEFAULT NULL,
  `borrowed_by` varchar(150) DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `quality` varchar(50) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `property_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `product_id` (`product_id`),
  KEY `office_id` (`office_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (71,111,'Filing Cabinet','Furniture','asd','SN-1072',13,'Rex','ICTS (Returned)','2026-04-13','New',1,'as'),(72,111,'Filing Cabinet','Furniture','asd','SN-1072',13,'Rex','ICTS (Returned)','2026-04-13','Defective',1,'as'),(73,48,'Air Conditioner','asd','asd','SN-1009',7,'Aira','Accounting (Returned)','2026-04-13','New',1,'as'),(74,48,'Air Conditioner','asd','asd','SN-1009',7,'Aira','Accounting (Returned)','2026-04-13','New',1,'as'),(75,138,'Air Conditioner','asd','asd','SN-1099',8,'Aira','Admin (Returned)','2026-04-13','New',1,'as'),(76,138,'Air Conditioner','asd','asd','SN-1099',8,'Aira','Admin (Returned)','2026-04-13','New',1,'as'),(77,138,'Air Conditioner','asd','asd','SN-1099',8,'Aira','Admin (Returned)','2026-04-13','New',1,'as'),(78,140,'Epson L3210','a','d','SN-1100',7,'Bless','Accounting (Returned)','2026-04-13','New',1,'s'),(79,140,'Epson L3210','a','d','SN-1100',7,'Bless','Accounting (Returned)','2026-04-13','Defective',1,'s');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_all_inventory`
--

DROP TABLE IF EXISTS `view_all_inventory`;
/*!50001 DROP VIEW IF EXISTS `view_all_inventory`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_all_inventory` AS SELECT 
 1 AS `transaction_id`,
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `product_type`,
 1 AS `product_model`,
 1 AS `serial_number`,
 1 AS `property_number`,
 1 AS `office_id`,
 1 AS `received_by`,
 1 AS `borrowed_by`,
 1 AS `transaction_date`,
 1 AS `quality`,
 1 AS `quantity`,
 1 AS `office_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_all_inventory`
--

/*!50001 DROP VIEW IF EXISTS `view_all_inventory`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_all_inventory` AS select `t`.`transaction_id` AS `transaction_id`,`t`.`product_id` AS `product_id`,`t`.`product_name` AS `product_name`,`t`.`product_type` AS `product_type`,`t`.`product_model` AS `product_model`,`t`.`serial_number` AS `serial_number`,`t`.`property_number` AS `property_number`,`t`.`office_id` AS `office_id`,`t`.`received_by` AS `received_by`,`t`.`borrowed_by` AS `borrowed_by`,`t`.`transaction_date` AS `transaction_date`,`t`.`quality` AS `quality`,`t`.`quantity` AS `quantity`,`o`.`office_name` AS `office_name` from (`transactions` `t` join `offices` `o` on((`t`.`office_id` = `o`.`office_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 16:10:30
