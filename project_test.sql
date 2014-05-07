CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `project`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer_accounts`
--

DROP TABLE IF EXISTS `customer_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_accounts` (
  `cust_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cust_name` varchar(255) NOT NULL,
  `cust_phoneno` varchar(11) NOT NULL,
  `cust_password` text NOT NULL,
  `cust_access_token` varchar(255) DEFAULT NULL,
  `cust_joined_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cust_id`),
  UNIQUE KEY `cust_phoneno_UNIQUE` (`cust_phoneno`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_accounts`
--

LOCK TABLES `customer_accounts` WRITE;
/*!40000 ALTER TABLE `customer_accounts` DISABLE KEYS */;
INSERT INTO `customer_accounts` VALUES (1,'','11','oQcK+1+apMuv0FjWihz23gesE9NtiX+GJxyISftHscmrOepPFAJJdsjNUYigeKGot4v/0gM72sG38Eu3W0I+I8rxU+nuh4nocNBFRq+2PaCwadTIbnuKjakV8+0WKWhozqe1M21uNCI5KSSTo9K3CzUL3edWrCF37EQdPASoRGs6TfeiqxSGaJ+URvsRGaxxe8U6eMNCUg8lJVwXAqjc0RxQRo1d1N5hiBvuE3SokOMbzMflSa8bNILOuBUQz0z+NtKzgaRs8geb6LQyicEQ/5e4Uk0EhNYa6UxlX1YDN2f4CXglRCzFwGLfskZ540SY1hxPd/JDvKMPPJ+ab7kftg==:/NgMt6ZcFu8qg/X2nFTrBTKaIcTnBs6f5Yr2NEm8nG4A4ysOhHlsqTGMi9ApsxpYkjaxB9PV6GJCB2NhrCkqJOxPt5rFFX08UbQJito3KtiGQAIk3VkLXSONDre4JKBWMQCVqLFbmsaYx++14RyxKU5wgS0A60YjlFDICOayiGk=','a2ba1330-d4f0-11e3-aef2-19d00b750e66','2014-05-06 07:32:54'),(2,'','134','oQcK+1+apMuv0FjWihz23gesE9NtiX+GJxyISftHscmrOepPFAJJdsjNUYigeKGot4v/0gM72sG38Eu3W0I+I8rxU+nuh4nocNBFRq+2PaCwadTIbnuKjakV8+0WKWhozqe1M21uNCI5KSSTo9K3CzUL3edWrCF37EQdPASoRGs6TfeiqxSGaJ+URvsRGaxxe8U6eMNCUg8lJVwXAqjc0RxQRo1d1N5hiBvuE3SokOMbzMflSa8bNILOuBUQz0z+NtKzgaRs8geb6LQyicEQ/5e4Uk0EhNYa6UxlX1YDN2f4CXglRCzFwGLfskZ540SY1hxPd/JDvKMPPJ+ab7kftg==:/NgMt6ZcFu8qg/X2nFTrBTKaIcTnBs6f5Yr2NEm8nG4A4ysOhHlsqTGMi9ApsxpYkjaxB9PV6GJCB2NhrCkqJOxPt5rFFX08UbQJito3KtiGQAIk3VkLXSONDre4JKBWMQCVqLFbmsaYx++14RyxKU5wgS0A60YjlFDICOayiGk=','a2ba1330-d4f0-11e3-aef2-19d00b750e66','2014-05-06 07:32:54');
/*!40000 ALTER TABLE `customer_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dining_tables`
--

DROP TABLE IF EXISTS `dining_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dining_tables` (
  `tbl_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tbl_rest_id` bigint(20) NOT NULL,
  `tbl_capacity` int(11) NOT NULL,
  `tbl_display_order` int(11) NOT NULL,
  PRIMARY KEY (`tbl_id`),
  KEY `tbl_dining_tables_restaurants_tbl_rest_id_idx` (`tbl_rest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dining_tables`
--

LOCK TABLES `dining_tables` WRITE;
/*!40000 ALTER TABLE `dining_tables` DISABLE KEYS */;
/*!40000 ALTER TABLE `dining_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dishes` (
  `d_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `d_rest_id` bigint(20) NOT NULL,
  `d_name` varchar(255) NOT NULL,
  `d_price` decimal(10,2) NOT NULL,
  `d_display_order` int(11) NOT NULL,
  PRIMARY KEY (`d_id`),
  KEY `fk_dishes_restaurants_rest_id_idx` (`d_rest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

LOCK TABLES `dishes` WRITE;
/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
/*!40000 ALTER TABLE `dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitations` (
  `inv_id` bigint(20) NOT NULL,
  `inv_cust_id` bigint(20) NOT NULL,
  `inv_order_id` bigint(20) NOT NULL,
  `inv_is_host` enum('true','false') NOT NULL,
  `inv_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `inv_status` char(1) NOT NULL,
  KEY `fk_invitations_customer_accounts_inv_cust_id_idx` (`inv_cust_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` VALUES (1,11,1,'true','2014-05-06 12:43:05','1'),(2,2,1,'true','2014-05-06 12:44:05','1'),(2,1,15,'true','2014-05-06 16:10:53','1'),(2,2,15,'true','2014-05-06 16:10:53','1'),(2,1,16,'true','2014-05-06 16:12:03','1'),(2,2,16,'true','2014-05-06 16:12:03','1'),(3,1,17,'true','2014-05-06 18:00:34','d'),(3,2,17,'true','2014-05-06 18:00:47','a'),(4,1,18,'true','2014-05-06 16:12:40','1'),(4,2,18,'true','2014-05-06 16:12:40','1'),(5,1,19,'true','2014-05-06 16:13:04','1'),(5,2,19,'true','2014-05-06 16:13:04','1'),(6,1,20,'true','2014-05-06 16:13:17','1'),(6,2,20,'true','2014-05-06 16:13:17','1'),(7,1,21,'true','2014-05-06 16:14:07','1'),(7,2,21,'true','2014-05-06 16:14:07','1'),(8,1,22,'true','2014-05-06 16:14:57','1'),(8,2,22,'true','2014-05-06 16:14:57','1'),(9,1,23,'true','2014-05-06 16:32:15','1'),(9,2,23,'true','2014-05-06 16:32:15','1'),(10,1,24,'true','2014-05-06 16:36:00','1'),(10,2,24,'true','2014-05-06 16:36:00','1');
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `oitem_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `oitem_order_id` bigint(20) NOT NULL,
  `oitem_name` varchar(255) NOT NULL,
  `oitem_price` decimal(10,2) NOT NULL,
  `oitem_quantity` int(11) NOT NULL,
  PRIMARY KEY (`oitem_id`),
  KEY `fk_order_items_orders_oitem_order_id_idx` (`oitem_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,13,'Big Mac',18.00,3),(2,13,'Big Mac 2',20.00,1),(3,14,'Big Mac',18.00,3),(4,14,'Big Mac 2',20.00,1),(5,15,'Big Mac',18.00,3),(6,15,'Big Mac 2',20.00,1),(7,16,'Big Mac',18.00,3),(8,16,'Big Mac 2',20.00,1),(9,17,'Big Mac',18.00,3),(10,17,'Big Mac 2',20.00,1),(11,18,'Big Mac',18.00,3),(12,18,'Big Mac 2',20.00,1),(13,19,'Big Mac',18.00,3),(14,19,'Big Mac 2',20.00,1),(15,20,'Big Mac',18.00,3),(16,20,'Big Mac 2',20.00,1),(17,21,'Big Mac',18.00,3),(18,21,'Big Mac 2',20.00,1),(19,22,'Big Mac',18.00,3),(20,22,'Big Mac 2',20.00,1),(21,23,'Big Mac',18.00,3),(22,23,'Big Mac 2',20.00,1),(23,24,'Big Mac',18.00,3),(24,24,'Big Mac 2',20.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `o_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `o_rest_id` bigint(20) NOT NULL,
  `o_cust_id` bigint(20) NOT NULL,
  `o_totalprice` decimal(10,2) NOT NULL,
  `o_num_people` tinyint(4) NOT NULL,
  `o_request_date` date NOT NULL,
  `o_request_period` tinyint(4) NOT NULL,
  `o_schedule_info` text,
  `o_status` tinyint(4) NOT NULL,
  `o_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `o_updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`o_id`),
  KEY `fk_orders_restaurants_o_rest_id_idx` (`o_rest_id`),
  KEY `fk_orders_customer_accounts_o_cust_id_idx` (`o_cust_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:54:07','0000-00-00 00:00:00'),(2,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:55:29','0000-00-00 00:00:00'),(3,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:56:29','0000-00-00 00:00:00'),(4,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:56:52','0000-00-00 00:00:00'),(5,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:57:41','0000-00-00 00:00:00'),(6,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:58:16','0000-00-00 00:00:00'),(7,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:58:41','0000-00-00 00:00:00'),(8,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:58:49','0000-00-00 00:00:00'),(9,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:58:58','0000-00-00 00:00:00'),(10,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 15:59:51','0000-00-00 00:00:00'),(11,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:00:02','0000-00-00 00:00:00'),(12,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:01:10','0000-00-00 00:00:00'),(13,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:08:30','0000-00-00 00:00:00'),(14,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:10:17','0000-00-00 00:00:00'),(15,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:10:53','0000-00-00 00:00:00'),(16,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:12:03','0000-00-00 00:00:00'),(17,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:12:38','0000-00-00 00:00:00'),(18,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:12:40','0000-00-00 00:00:00'),(19,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:13:04','0000-00-00 00:00:00'),(20,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:13:17','0000-00-00 00:00:00'),(21,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:14:07','0000-00-00 00:00:00'),(22,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:14:57','0000-00-00 00:00:00'),(23,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:32:15','0000-00-00 00:00:00'),(24,1,1,74.00,2,'2014-05-05',1,'',1,'2014-05-06 16:36:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_accounts`
--

DROP TABLE IF EXISTS `restaurant_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurant_accounts` (
  `ra_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ra_name` varchar(255) NOT NULL,
  `ra_password` text NOT NULL,
  `ra_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ra_access_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ra_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_accounts`
--

LOCK TABLES `restaurant_accounts` WRITE;
/*!40000 ALTER TABLE `restaurant_accounts` DISABLE KEYS */;
INSERT INTO `restaurant_accounts` VALUES (1,'mcd','jwX0gqprwmDGn8GDrUEQYvde3Gae6/NF4C9ZYad43U42RuUes+u6m366aqfWG8Gqeno84xSPp5p9Czcv85a3Icn9KU8RBIoiUBtzqz3Eu5G0Yv9o1ZQaUjP0hyW1LsmmoqLSPRrytyQLhfSODiQJ6uxH3IVX/JDTVJI+bRp8YF/16lpXWIuxJNUUXDiBQk5/rLVqtlqnjvHAu0oNKAemjcnmdxfzf4H3xLjoxfRpzEueYMminY59H7L9yIgbnKM9w17/xVpg3lbAwCyD96fLUOy24pmOmOLLOmeSXGQ0JcM0w3dHlZiBLeDYsmka3c12S/A/9FmdSDGDrwoUpHKddw==:n3NQn+aFPk3FtcVh/Crm/y+uEM+vA4IAbD0gdDlTpFohxRqEeNEfebGK5UI4iMWKIH9xzNnlGxLxFGkerx3gj8BQILCAVxORGAJNIvB2titvj+mWCPIHuXZ7Iq5wDa+JHYUdKekRnpZ5TwLOSDpIdzopNSH3cW3wP2B2v5OBfWc=','2014-05-06 16:06:21',NULL),(2,'mcdonald','IbBpLo/ZLkT5GjZZZffGGW2l0KedeXXuhIcnQtBnsshYcg/ett0Firs3iaJrU/O6suySkx6OmZ74jbTQCjDu60iNoaVzSJVmxN44jILdquuZfxMTnBPC5wjP6hxw6givrDQXVnwo3BlAZaNgxryOtLpqltlPVRY9WZFiyjJkBlkcrFWGC/cnivx+dw8tFzAavfruTy7UfqHN7DTpRJGKHtTca9DIhhMKf8hdp2ZL16PwR/YzyRt/lb1XcCJ29LBaApWQAObALMORUGZiRyIL0KStraPxYOp6JnF9RQo10OB21eGlW5rmNjosAXK4yuQkBQHnJkithDhE2VNut9oEAQ==:I7pCpeX0YQnsg68CAH2poWFLtA1Arny5HKjhCXbPuTJ1nrJ+efk0BPp94kK4k00+TY28y+tnfuH/wS0BqxG/Rs72IKdNRR8sXP//fCX4EbGoRmlL6QFjEZgS+COJNIp3Hv1JGfRDZTMGAZGINyxXe1wKWXIi8/o/UxpSiP7buaw=','2014-05-07 07:13:52',NULL);
/*!40000 ALTER TABLE `restaurant_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurants` (
  `rest_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rest_owner_id` bigint(20) NOT NULL,
  `rest_name` varchar(255) NOT NULL,
  `rest_address` varchar(255) NOT NULL,
  `rest_geo_location` point DEFAULT NULL,
  `rest_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rest_id`),
  KEY `fk_restaurants_restaurant_accounts_rest_owner_id_idx` (`rest_owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,1,'mcdonald','xx street xxx','\0\0\0\0\0\0\0\0\0\0\0\0\04@\0\0\0\0\0\0$@','pic.here'),(2,2,'not a macdonald','some street','\0\0\0\0\0\0\0\0\0\0\0\0\04@\0\0\0\0\0\0$@','no.pic.here');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `table_schedules`
--

DROP TABLE IF EXISTS `table_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `table_schedules` (
  `ts_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ts_rest_id` bigint(20) NOT NULL,
  `ts_order_id` bigint(20) NOT NULL,
  `ts_table_id` bigint(20) NOT NULL,
  `ts_date` date NOT NULL,
  `ts_start_time` time NOT NULL,
  `ts_end_time` time NOT NULL,
  `ts_valid` enum('true','false') NOT NULL,
  PRIMARY KEY (`ts_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `table_schedules`
--

LOCK TABLES `table_schedules` WRITE;
/*!40000 ALTER TABLE `table_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `table_schedules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-05-07 21:04:43
