CREATE DATABASE  IF NOT EXISTS `restaurant` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `restaurant`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: localhost    Database: restaurant
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_accounts`
--

LOCK TABLES `customer_accounts` WRITE;
/*!40000 ALTER TABLE `customer_accounts` DISABLE KEYS */;
INSERT INTO `customer_accounts` VALUES (1,'john','123456','7OL9mQMQjnOYSvDi4UGEkGpxEqzEG8XgfvhKzNRLD232Togy0xibhpRKJfEGcc2ugYFTZYo11B/MAF0WLFuxNFoOl5xUuVrFvWE92z9XQxbMJBVarG1fktEd9Z5Q0Ft33DXFgXnWYzwtO7XYMekuh5MngicrBkj77SOCQD90o25t+v9bsrTtuZhF1cV5AqrH6oFA7SgcaTnlR4ePNCBxCDhgxkh7g3All72q1Iv0SRDYmriFKLJO1gVdC6KDWt/nJ1PPlnstQ+m3lfXBqCMQj2qnpKg3dRGCBGk3M/SEAm9woEIq3ILpOJ0/9cA1VK///J4BcC7j80+IzKRXzyC6WQ==:IkURcj4mqZ9TpZ94AcMoe/2Fu/XlaDrZltTvVPm28o5x7iWLvo8JB/mUNVwhOV6ltQWgMwQehnFxrv0w464EcEIQnAvA8otwJuZelILE1zJLKOa7uE3ywY5RiH9FpIxHZpwi7QzHo9o67MtfK3bax2VGnYBPUaY6ZiYclN3+blo=','a3cfacc0-d5ff-11e3-a61a-21ae64649dbd','2014-05-07 15:52:49'),(2,'foobar','321456','Ej7CWX0D0VN0+eDUVzPrXuSUEo5WmPj2XjqgM9G1+expBpxuDl4C1FoDk9vBQ69Ug1O7HWZDYbmGfI0I+AE73vrqIzxCbsuaVxrH5BqxUz9K/ni1gRMgZyYRGyoqLW1TK3Wpny35Wh0wdCBBQBGZd2YSH+AjUiWd8NrhfZi6G7RCxON/q9A1siTvRLEHxpx1Z8XLctBEBtx3BDW78q/1j5tX5F/OcpmPtAP4D5T5XHgygs8umy5p2Mg+tjR6NJTPS83eo2hlhbI/18mNxYNf9KNDQp9ToF8ogW7IrNd0zQqjgQga1sycbWRlPq8uhN4jue2ZE/wmb1kppR3CdMwPQw==:ynvaTnrRiFu/QR5wgLc3vqAG1nl3pjv2wwSnooGN2pc3l7K35h3LoXxXuMbXt0/Lm+m3hCLTkbMLW5SpBXWudtOBoqJ1k+i2S2io7reSOQUS6222rHyJ1O0+fmu+EkLYnWD3tj1+kMN8zOqAKh8c07osCkwDQD4iL806MmXjeEU=','af470210-d5ff-11e3-a61a-21ae64649dbd','2014-05-07 15:53:08'),(3,'name','123123','62kBOLzq/6mZewAvMdzs0CTbfKgdRa3FuLsiOudjZo4JCuW75Ji5wGfLpLhkMsEgavKQt/el7c70TsttepRVCQdhvgwrRLS285+4rx42LNHf98BM8P4QkOenea80MzUujNJDnfUug77eXoCyvBGBTxeB/8TNpPHjv+4IPa1G4nW4xWVwgOx9dR4taKSpTVPFsdkujmEhD3qvpaaRmwQ4ku6VIGWmLyUNp43CgPSgelWtj8xTxszeZjOgCYyOvckVI3xxDsPhTcK2SOFTVBkwU418UxvJ5Op/GDmQEcDJqo0V+6J5ZzsCQv94zmlnCCnEnLbkhnzCOsnag7PecFGwew==:LFuAnhsfAJOG5Vh5NucS68cMUBogpkPnxeTwzJyRbaPUgtmInpIkC+zOW1JYwcLGlOv6xWrA02SYJx8ri9isxv+7OVkhhaHUb+DpVybKph9w9H28CvCDPMWYgVSeIKVG5GqeEf0R9vv31ozhmaL3Z9a/fKmcVbliGgDacllBt80=','b8df5e30-d5ff-11e3-a61a-21ae64649dbd','2014-05-07 15:53:24');
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
  PRIMARY KEY (`tbl_id`)
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
  PRIMARY KEY (`d_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

LOCK TABLES `dishes` WRITE;
/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
INSERT INTO `dishes` VALUES (1,1,'bigmac',20.00,0),(2,1,'mcspicy',15.00,0),(3,2,'small pizza',5.00,0),(4,2,'medium pizza',10.00,0),(5,2,'large pizza',15.00,0);
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
  `inv_status` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
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
  PRIMARY KEY (`oitem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
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
  PRIMARY KEY (`o_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
INSERT INTO `restaurant_accounts` VALUES (1,'mcd','GoGlQJJfA05TVPMqQ7ylIjcWk4DUWGkdHmycQ1Mdj51uqZKIgdREgFngaAiOPhOZfCR3fuIe163lZUz4v3KENfmCLQgOeAer1CqmTagluIuBIDco8fuv1pE1adaqYQ3c78xrNCH+57/kup7o8E6N1jHGgDMUZsGRff0aLwLCGDMlla9jv+Iu7pCop+WIVjkGKY5B7DGccTFsBDKs6xDGhjAQD7MncAU2dbg9ehNcDnqMo3gp0FvWh6C0dSMdprhqsnR5h0fdeSgQK2UDMM1uc81oho5lbOavLvejX/vGFn+322pp2Fr2mz8tKi60CUjUTvP+GxAuLazH9DOK+zJh2Q==:dlyn0pX1d74sYNAk2qUOZCXyq0ZX+zLW5vSEaec2aoSG4G5SSnb5U57bTzABnmwS8A2eLIvxC/lg1b0MFHkD6va/JPf7LNKBhU5MeDz90uczRm4laaH22xtH9+pFda7ztsiHxsqqcNubiuUxp6cw8dFHd8J0IgGI4J77t3bbno4=','2014-05-07 15:35:12',NULL),(2,'pizza1','RRxzXwbR7bNiXHm0wxRG46/RRaUNJZQVNEI+4Sv44C2Dq9RIqPI9eFhon3gKmqnhQkQzUy/gN+uS60pxXPp1a8//mzCP+ufNKxv1XgIIkUf1yILBWvdjE2neP/+KIPjp25sMN2ZAFGIdWrUdENz/bcuQyvGHGA4hv/gNEyBMVGuNluaYJpNypYPKMk2AwG3/wrtNr2tjtTh5tQBAuKSvv5kV7XMvXdNaZjbWS8BErHnhHO5s6sj/p+TrVK5g0vw9FxbQWv7P8sWftKm4oXtf3dXWHKRcS+OWi/bMS1o7JbiK3OlzxEUS9xPPWEQ+MW6nKPy050hCFYLCudhfyv52kg==:JaEXtUErqI013PDJWyOM/BKcHYg5sGDI6ERl6oypsM4eOzQUy4gfBl85rV+cUkBdjQNtWP5LDu49yxIMuCyGCzH7SzW3zPYXPqYDkmkg9W7KWmD5VBUygWEiui4h7LwIw7wGarbQzNsF36YXaK29nvepbDsty57wo4NX2XwTycM=','2014-05-07 15:36:17',NULL);
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
  PRIMARY KEY (`rest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,1,'McDonald','xx street xxx','\0\0\0\0\0\0\0\0\0\0\0\0\0$@\0\0\0\0\0\0$@','custom.pic'),(2,2,'Good Pizza','someplace nearby','\0\0\0\0\0\0\0\0\0\0\0\0\0/@мллллL8@','custom.pic.here');
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

-- Dump completed on 2014-05-07 23:57:54
