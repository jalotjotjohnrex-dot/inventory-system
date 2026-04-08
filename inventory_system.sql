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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,13,47,'New Transaction: Screw Driver',1,'2026-03-18 03:56:10'),(2,7,47,'New Transaction: Screw Driver',1,'2026-03-18 03:56:10'),(3,13,47,'Asset Returned: Screw Driver',1,'2026-03-18 03:57:21'),(4,7,47,'Asset Returned: Screw Driver',1,'2026-03-18 03:57:21'),(5,13,48,'New Transaction: Screw Driver',1,'2026-03-19 06:26:44'),(6,24,48,'New Transaction: Screw Driver',0,'2026-03-19 06:26:44'),(7,7,48,'New Transaction: Screw Driver',1,'2026-03-19 06:26:44'),(8,13,48,'Asset Returned: Screw Driver',1,'2026-03-19 06:37:50'),(9,24,48,'Asset Returned: Screw Driver',0,'2026-03-19 06:37:50'),(10,7,48,'Asset Returned: Screw Driver',1,'2026-03-19 06:37:50'),(11,13,49,'New Transaction: Screw Driver',1,'2026-03-19 07:19:15'),(12,24,49,'New Transaction: Screw Driver',0,'2026-03-19 07:19:16'),(13,7,49,'New Transaction: Screw Driver',1,'2026-03-19 07:19:16'),(14,13,49,'Asset Returned: Screw Driver',1,'2026-03-19 07:30:48'),(15,24,49,'Asset Returned: Screw Driver',0,'2026-03-19 07:30:48'),(16,7,49,'Asset Returned: Screw Driver',1,'2026-03-19 07:30:48'),(17,13,50,'New Transaction: Screw Driver',1,'2026-03-19 07:41:34'),(18,24,50,'New Transaction: Screw Driver',0,'2026-03-19 07:41:34'),(19,7,50,'New Transaction: Screw Driver',1,'2026-03-19 07:41:34'),(20,13,50,'Asset Returned: Screw Driver',1,'2026-03-19 07:43:19'),(21,24,50,'Asset Returned: Screw Driver',0,'2026-03-19 07:43:19'),(22,7,50,'Asset Returned: Screw Driver',1,'2026-03-19 07:43:19'),(23,7,51,'New Transaction: Bottle Glass',1,'2026-03-19 08:05:16'),(24,24,51,'New Transaction: Bottle Glass',0,'2026-03-19 08:05:16'),(25,13,51,'New Transaction: Bottle Glass',1,'2026-03-19 08:05:16'),(26,7,51,'Asset Returned: Bottle Glass',1,'2026-03-19 08:18:45'),(27,24,51,'Asset Returned: Bottle Glass',0,'2026-03-19 08:18:45'),(28,13,51,'Asset Returned: Bottle Glass',1,'2026-03-19 08:18:45'),(29,7,54,'New Transaction: Bottle Glass',1,'2026-03-19 08:21:37'),(30,24,54,'New Transaction: Bottle Glass',0,'2026-03-19 08:21:37'),(31,13,54,'New Transaction: Bottle Glass',1,'2026-03-19 08:21:37'),(32,7,54,'Asset Returned: Bottle Glass',1,'2026-03-19 08:22:28'),(33,24,54,'Asset Returned: Bottle Glass',0,'2026-03-19 08:22:28'),(34,13,54,'Asset Returned: Bottle Glass',1,'2026-03-19 08:22:28'),(35,7,56,'New Transaction: Bottle Glass',1,'2026-03-19 08:26:32'),(36,24,56,'New Transaction: Bottle Glass',0,'2026-03-19 08:26:32'),(37,13,56,'New Transaction: Bottle Glass',1,'2026-03-19 08:26:32'),(38,7,56,'Asset Returned: Bottle Glass',1,'2026-03-19 08:30:41'),(39,24,56,'Asset Returned: Bottle Glass',0,'2026-03-19 08:30:41'),(40,13,56,'Asset Returned: Bottle Glass',1,'2026-03-19 08:30:41'),(41,7,57,'New Transaction: Bottle Glass',1,'2026-03-19 08:34:14'),(42,24,57,'New Transaction: Bottle Glass',0,'2026-03-19 08:34:14'),(43,13,57,'New Transaction: Bottle Glass',1,'2026-03-19 08:34:14'),(44,7,57,'Asset Returned: Bottle Glass',1,'2026-03-19 08:44:57'),(45,24,57,'Asset Returned: Bottle Glass',0,'2026-03-19 08:44:57'),(46,13,57,'Asset Returned: Bottle Glass',1,'2026-03-19 08:44:58'),(47,13,59,'New Transaction: Screw Driver',1,'2026-03-19 08:54:40'),(48,24,59,'New Transaction: Screw Driver',0,'2026-03-19 08:54:41'),(49,7,59,'New Transaction: Screw Driver',1,'2026-03-19 08:54:41'),(50,13,59,'Asset Returned: Screw Driver',1,'2026-03-19 08:55:14'),(51,24,59,'Asset Returned: Screw Driver',0,'2026-03-19 08:55:14'),(52,7,59,'Asset Returned: Screw Driver',1,'2026-03-19 08:55:14'),(53,7,61,'New Transaction: Earphones',1,'2026-03-19 09:06:06'),(54,24,61,'New Transaction: Earphones',0,'2026-03-19 09:06:06'),(55,13,61,'New Transaction: Earphones',1,'2026-03-19 09:06:06'),(56,7,61,'Asset Returned: Earphones',1,'2026-03-19 09:06:51'),(57,24,61,'Asset Returned: Earphones',0,'2026-03-19 09:06:51'),(58,13,61,'Asset Returned: Earphones',1,'2026-03-19 09:06:51'),(59,13,62,'Asset Returned: Screw Driver',1,'2026-04-08 00:47:59'),(60,24,62,'Asset Returned: Screw Driver',0,'2026-04-08 00:48:00'),(61,7,62,'Asset Returned: Screw Driver',1,'2026-04-08 00:48:00'),(62,13,63,'New Transaction: Screw Driver',1,'2026-04-08 00:49:35'),(63,24,63,'New Transaction: Screw Driver',0,'2026-04-08 00:49:35'),(64,7,63,'New Transaction: Screw Driver',1,'2026-04-08 00:49:35'),(65,13,63,'Asset Returned: Screw Driver',1,'2026-04-08 00:50:07'),(66,24,63,'Asset Returned: Screw Driver',0,'2026-04-08 00:50:07'),(67,7,63,'Asset Returned: Screw Driver',1,'2026-04-08 00:50:07'),(68,10,64,'New Transaction: Monitor',0,'2026-04-08 00:51:51'),(69,24,64,'New Transaction: Monitor',0,'2026-04-08 00:51:51'),(70,8,64,'New Transaction: Monitor',0,'2026-04-08 00:51:51'),(71,10,64,'Asset Returned: Monitor',0,'2026-04-08 00:52:29'),(72,24,64,'Asset Returned: Monitor',0,'2026-04-08 00:52:29'),(73,8,64,'Asset Returned: Monitor',0,'2026-04-08 00:52:29'),(74,13,65,'New Transaction: Screw Driver',0,'2026-04-08 00:59:39'),(75,24,65,'New Transaction: Screw Driver',0,'2026-04-08 00:59:40'),(76,7,65,'New Transaction: Screw Driver',0,'2026-04-08 00:59:40'),(77,13,65,'Asset Returned: Screw Driver',0,'2026-04-08 01:00:02'),(78,24,65,'Asset Returned: Screw Driver',0,'2026-04-08 01:00:02'),(79,7,65,'Asset Returned: Screw Driver',0,'2026-04-08 01:00:02');
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
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (6,'Charger','electronics','System Default','67554',1,12,'New'),(7,'Mouse','electronics','System Default','67558',3,7,'New'),(8,'Printer','electronics','System Default','67559',2,12,'New'),(9,'Tissue','Hardware','System Default','2354',5,5,'New'),(11,'Earphones','electronics','System Default','m12',5,7,'New'),(12,'Screw Driver','Hardware','System Default','m15',3,13,'New'),(13,'Bond Paper','paper','System Default','b23',10,1,'New'),(14,'Box','paper','System Default','c45',5,2,'New'),(15,'Blower','electronics','System Default','v45',5,3,'New'),(16,'Vaccum','electronics','System Default','x3',5,4,'New'),(17,'Alcohol','Water','System Default','z3',5,6,'New'),(18,'Electric Fan','electronics','System Default','b7',5,8,'New'),(19,'Mic','electronics','System Default','n4',5,9,'New'),(20,'Monitor','electronics','System Default','m5',5,10,'New'),(21,'CCTV','electronics','System Default','t4',5,11,'New'),(22,'POE Switch','Hardware','System Default','y4',5,14,'New'),(23,'Hagdan','Hardware','System Default','e4',5,15,'New'),(24,'Broom','electronics','System Default','y7',5,15,'New'),(25,'Dust Pan','electronics','System Default','u4',5,16,'New'),(26,'Bulb','electronics','System Default','r65',5,17,'New'),(27,'Table','electronics','System Default','l3',5,18,'New'),(28,'Cable','electronics','System Default','l5',5,19,'New'),(29,'LAN','electronics','System Default','l0',5,20,'New'),(30,'Cabinet','Hardware','System Default','a56',5,21,'New'),(31,'ToolBox','Hardware','System Default','s5',5,22,'New'),(32,'Screw','Hardware','System Default','d6',5,23,'New'),(33,'Pin','Hardware','System Default','f5',5,24,'New'),(34,'Bottle Glass','Personal','System Default','bcsf1',5,7,'New'),(35,'Power Cord','electronics','System Default','hjkjhc',1,7,'New'),(36,'TP Link','electronics','System Default','hjkjhc5',5,14,'New'),(37,'Data Cabinet','electronics','System Default','hjkjhc56',6,18,'New'),(38,'Access Point','electronics','System Default','hjkjhc5621',3,16,'New');
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (9,NULL,'Charger','Charger','adsd','1233',7,'Rex','- Returned -','2026-03-12','New',1,NULL),(10,NULL,'Mouse','mouse','12123','423',8,'Rex','- Returned -','2026-03-12','New',3,NULL),(13,NULL,'Tissue','tissue','123','34',13,'Rex','- Returned -','2026-03-12','New',3,NULL),(18,NULL,'Mouse','tissue','123','34565',7,'Rex','- Returned -','2026-03-12','Defective',1,NULL),(19,NULL,'Bond Paper','paper','dfg','152',1,'Rex','- Returned -','2026-03-12','Defective',1,NULL),(23,NULL,'Bond Paper','paper','457','78m',1,'Rex','- Returned -','2026-03-13','New',1,NULL),(24,NULL,'Screw Driver','Hardware','145','m34',13,'Rex','- Returned -','2026-03-13','New',1,NULL),(25,NULL,'Screw Driver','Hardware','148','m37',13,'Rex','- Returned -','2026-03-13','New',1,NULL),(28,NULL,'Screw Driver','Hardware','146','m38',13,'Rex','- Returned -','2026-03-13','New',1,NULL),(29,NULL,'Screw Driver','electronics','aad','fdf',7,'Rex','- Returned -','2026-02-23','Good Condition',1,NULL),(30,NULL,'Screw Driver','electronics','f2','fas',13,'Rex','- Returned -','2026-03-13','New',1,NULL),(31,NULL,'Pin','electronics','f2as','fasas',24,'Rex','- Returned -','2026-03-13','New',1,NULL),(32,NULL,'Screw Driver','electronics','f2asas','fasass',13,'Rex','- Returned -','2026-03-13','New',1,NULL),(33,NULL,'Screw Driver','electronics','f2asas1','fasass1',13,'Rex','- Returned -','2026-03-14','New',1,NULL),(34,NULL,'Screw Driver','electronics','f2asas1s','fasass1s',13,'Levi','ICTS (Returned)','2026-03-14','New',1,NULL),(35,NULL,'Broom','electronics','f2asas1sa','fasass1sa',15,'Levi','Admin (Returned)','2026-02-13','New',1,NULL),(36,NULL,'Pin','electronics','f2asas1saa','fasass1saa',24,'Levi','Assessor (Returned)','2026-03-13','New',1,NULL),(37,NULL,'Mic','electronics','as232','as12',9,'Aira','DILG (Returned)','2026-04-13','New',1,NULL),(38,NULL,'ToolBox','electronics','asd241','23sdsdf',22,'Rose','MPDO (Returned)','2026-04-26','New',1,NULL),(39,NULL,'Vaccum','electronics','asd6567','45fgx',4,'Bless','Library (Returned)','2025-01-11','New',1,NULL),(40,NULL,'CCTV','electronics','xcv2','cxv3',11,'Jeff','ICTS (Returned)','2026-02-22','Good Condition',1,NULL),(41,NULL,'CCTV','electronics','aszc34','xsdf4234',11,'Jeff','ICTS (Returned)','2026-03-13','Defective',1,NULL),(42,NULL,'Screw Driver','electronics','asdxc','xcva',13,'Jerrome','ICTS (Returned)','2026-03-16','Good Condition',1,NULL),(43,NULL,'Power Cord','electronics','asdxc2','xcva2',7,'Jerrome','Engineering (Returned)','2026-03-16','Defective',1,NULL),(44,NULL,'TP Link','asxc7','vbcv934','asdaxc684',14,'Mings','Budget (Returned)','2026-03-16','Good Condition',2,NULL),(45,NULL,'Data Cabinet','123sf','123sdf','sdfgsd4',18,'Errold','HRMO (Returned)','2026-03-16','Good Condition',2,NULL),(46,NULL,'Access Point','electronics','21sdf1','12sdfxc3',16,'Louie','Tourism (Returned)','2026-03-16','New',3,NULL),(47,NULL,'Screw Driver','electronics','asd2cv','xcvewqw',13,'Mark','ICTS (Returned)','2026-03-18','Good Condition',1,NULL),(48,NULL,'Screw Driver','electronics','341dvfvz','sfdesfdsf4234',13,'Ellaine','ICTS (Returned)','2026-03-19','New',1,NULL),(49,NULL,'Screw Driver','electronics','341dvfvz32','sfdesfdsf42344',13,'Suzaine','ICTS (Returned)','2026-03-19','Good Condition',1,NULL),(50,NULL,'Screw Driver','electronics','341dvfvz325','sfdesfdsf423445',13,'Suzaine','ICTS (Returned)','2026-03-19','Defective',1,NULL),(51,NULL,'Bottle Glass','electronics','341dvfvz325','bcsf1',7,'Suzaine','Accounting (Returned)','2026-03-19','Defective',1,NULL),(54,NULL,'Bottle Glass','electronics','341dvfvz325','asdu56',7,'Mat','Accounting (Returned)','2026-03-19','Defective',1,NULL),(56,NULL,'Bottle Glass','electronics','341dvfvz325','bcsf1asd',7,'Mat','Accounting (Returned)','2026-03-19','New',1,NULL),(57,NULL,'Bottle Glass','electronics','341dvfvz325asd','bcsf1asdasd',7,'Tam','Accounting (Returned)','2026-03-19','Good Condition',1,NULL),(59,NULL,'Screw Driver','electronics','341dvfvz325asdx','bcsf1asdasdx',13,'Cha','ICTS (Returned)','2026-03-19','Good Condition',1,NULL),(61,NULL,'Earphones','electronics','341dvfvz325asdxs','m12',7,'Gen','Accounting (Returned)','2026-03-19','Good Condition',1,NULL),(62,12,'Screw Driver','Hardware','Model','m15',13,'Kenneth','ICTS (Returned)','2026-04-08','New',1,NULL),(63,12,'Screw Driver','Hardware','12594css','m15',13,'Kenneth','ICTS (Returned)','2026-04-08','Good Condition',1,' ntfju283yd'),(64,20,'Monitor','electronics','add','m5',10,'bless','Mayor\'s (Returned)','2026-04-08','Good Condition',1,'asdadxcvcbxrt'),(65,12,'Screw Driver','sdf','sd5e','m15',13,'Rex','ICTS (Returned)','2026-04-08','Good Condition',1,'bvxfkrh');
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

-- Dump completed on 2026-04-08 14:00:43
