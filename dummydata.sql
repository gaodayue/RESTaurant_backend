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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_accounts`
--

LOCK TABLES `customer_accounts` WRITE;
/*!40000 ALTER TABLE `customer_accounts` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_accounts`
--

LOCK TABLES `restaurant_accounts` WRITE;
/*!40000 ALTER TABLE `restaurant_accounts` DISABLE KEYS */;
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
  `rest_owner_id` bigint(20) DEFAULT NULL,
  `rest_name` varchar(255) NOT NULL,
  `rest_address` varchar(255) NOT NULL,
  `rest_geo_location` point DEFAULT NULL,
  `rest_pic` varchar(255) DEFAULT NULL,
  `rest_pic_thumb` varchar(255) DEFAULT NULL,
  `rest_google_id` varchar(255) DEFAULT NULL,
  `rest_google_reference` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rest_id`),
  UNIQUE KEY `rest_google_id_UNIQUE` (`rest_google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,NULL,'Jiayuan Hotel','6 Daliushu Rd, Haidian','\0\0\0\0\0\0\00u×ƒ]@èô¼úC@',NULL,NULL,'896931c6ffa4ed0757df2afc60cb13dc20a15e2e',NULL),(2,NULL,'Shangyuan Hotel','40 Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\00PR`]@¡¹N#-ùC@',NULL,NULL,'3804683718acedb3d3c336d60db0a69e95044255',NULL),(3,NULL,'Hongguoyuan Hotel','è¥¿ç›´é—¨å¤–ä¸Šå›­æ‘3å·åŒ—æ–¹äº¤å¤§é™¢å†…, Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0¨Ì?ú]@ßú°Ş¨ùC@',NULL,NULL,'a381ec514a500843301560eba13cf2a00c976af9',NULL),(4,NULL,'Beijing Jiaotong University Student Er Restaurant','15 Gaoliangqiao Byway, Haidian, Beijing','\0\0\0\0\0\0\0°F=D£]@ÿé\n¼ùC@',NULL,NULL,'644332158f7248968e0cc3a22013c71672467962',NULL),(5,NULL,'Lingering Garden','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0BÎûÿ]@Üğ»é–ùC@',NULL,NULL,'b33d67b6f1241c18fc62e474043caf2ac20bd336',NULL),(6,NULL,'é™æ€ç´ é£ŸåŠ','é«˜ç²±æ¡¥æ–œè¡—ç”²30å·æ¢…è‹‘é¥­åº—1-2æ¥¼ï¼ˆè¿‘äº¤é€šå¤§å­¦å—é—¨ï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0àŸR%Ê]@é*İ]gùC@',NULL,NULL,'96423986df09168e5501745de7bc0c0c9ce03cf0',NULL),(7,NULL,'åŒ—äº¬å’Œåº­é¤é¥®','é«˜æ¢æ¡¥æ–œè¡—18å·ä¸­è‹‘å®¾é¦†ä¸€å±‚, Haidian, Beijing','\0\0\0\0\0\0\0Ğfœ†¨]@Ÿ`<ùC@',NULL,NULL,'65544dac176bec8bbaffe9803b00df7e1a845c9f',NULL),(8,NULL,'Sankeshu','å¤ªå¹³åº„13å·, Qixiang Rd, Haidian','\0\0\0\0\0\0\0Ğ!©…’]@Um7Á7ùC@',NULL,NULL,'6849b2e1c5bc416b00e64c1afd0dc08737557052',NULL),(9,NULL,'ç§‘è‹‘é¤å…','2 Daliushu Rd, Haidian','\0\0\0\0\0\0\0PËH½§]@8ù-:YúC@',NULL,NULL,'dec50bcde8cfb642ee3ed43236ffa7c25469424e',NULL),(10,NULL,'ä¹å¤©ç›ç‰¹','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL,'dedd45fa5f0558e80f3cfcb25213a9f4e9fe8e73',NULL),(11,NULL,'é‚“è€å‡‰èŒ¶','å¤§æŸ³æ ‘å—ç«™åŒ—æ–¹äº¤å¤§è¥¿é—¨å¯¹é¢, Haidian, Beijing','\0\0\0\0\0\0\0€¹İË}]@¿¸T¥-úC@',NULL,NULL,'f10555fba7d6c551597b4f67c334728f42e8cc1e',NULL),(12,NULL,'Golden Phoenix','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0@—©Iğ]@Q§“lùC@',NULL,NULL,'f21a2f05590a9ee3fc1016cf06513677d1931e40',NULL),(13,NULL,'7-Eleven','Daliushu Rd, Haidian','\0\0\0\0\0\0\0@nøİt]@Ï‡g	2úC@',NULL,NULL,'2c46a7bf6bfa88c80f374d8a5513d1da4874bfa4',NULL),(14,NULL,'å¤§èŒ¶æ¯','3 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0 rL÷]@ŠsÔÑqùC@',NULL,NULL,'52373e3967faf35e1766e5c53f9eb495d032e76e',NULL),(15,NULL,'ç–¯ç‹‚çƒ¤ç¿…','é«˜æ¢æ¡¥æ–œè¡—ï¼ˆäº¤é€šå¤§å­¦å—é—¨å¯¹é¢ï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0pBZcĞ]@h>çnùC@',NULL,NULL,'aa46965676138c197280c30b807ee8b49a467d35',NULL),(16,NULL,'Fruitime','23 Daliushu Rd, Haidian','\0\0\0\0\0\0\0À‡-y]@®ğ.ñùC@',NULL,NULL,'bbfc2e8171d4540fb19d99358acd4bb3d5823287',NULL),(17,NULL,'é‡‘å‡¤æˆç¥¥','å†œå¤§ä¸œè·¯ä¸Šåœ°åè”è¶…å¸‚B1æ¥¼14å·ï¼ˆè¿‘ä¸Šåœ°å—å£ï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0 ™Õ;Ü]@ø¬8ùC@',NULL,NULL,'6ed56615a9b7ee0a7a5a37c2df82fdf64f0b892c',NULL),(18,NULL,'åŒ—äº¬æ¯”å¤šå¿«é¤æœ‰é™å…¬å¸','ä¸Šå›­æ‘32å·, Haidian, Beijing','\0\0\0\0\0\0\0¸šuÆ÷]@^ÖÄ_ùC@',NULL,NULL,'83f3ee3972dc09811b85d64020cb637b52e7bba1',NULL),(19,NULL,'é‡‘å‡¤æˆç¥¥äº¤å¤§äºŒåº—','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0p€™ïà]@^Iò\\ùC@',NULL,NULL,'98a0a542cb39967b53a162a388e25032e06ab234',NULL),(20,NULL,'é²œæœæ—¶å…‰','é«˜ç²±æ¡¥æ–œè¡—1å·èŸ¹è€å®‹é¦™é”…å¯¹é¢ï¼ˆè¿‘å¤§æ…§å¯ºï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0cëÂ]@üà|êXùC@',NULL,NULL,'d7964e311f6eea271134ded2c82a7a955656e9f8',NULL),(21,NULL,'ä¸‰å…ƒæ¢…å›­ä¹³å“åº—','Jiaotong Daxue Rd','\0\0\0\0\0\0\0`Êùbï]@é\r÷‘[ùC@',NULL,NULL,'e468ae23f4b34ccf32507dede354b8fa21b98d55',NULL),(22,NULL,'Golden Phoenix','Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0ø g³ê]@§ÉŒ·•úC@',NULL,NULL,'afe576a4e6e3cc134fb49d0ad4c7fa79118c02fd',NULL),(23,NULL,'Niushiniu','2 Dahuisi Rd, Haidian','\0\0\0\0\0\0\0â‘xy]@ÂøiÜùC@',NULL,NULL,'88cc8e8b3a5d8d3d60dcb2a549763c8410ea4133',NULL),(24,NULL,'ç”œå“æ—¶é—´','2 Daliushu Rd, Haidian','\0\0\0\0\0\0\0PËH½§]@8ù-:YúC@',NULL,NULL,'63a75237b16168f0d806277a09477ab4ec54dd82',NULL),(25,NULL,'Nadu Spicy-hot Hotpot','Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0ğÕÇCß]@r†â7ùC@',NULL,NULL,'5c21b2ab7b59001966ca425c0f190ad65dd7e78c',NULL),(26,NULL,'é«˜ä¸½ç‹æœé…±æ±¤ç‰›æ’ç«é”…','Haidian, Beijing','\0\0\0\0\0\0\0€\nG]@ÖÈ®´ŒúC@',NULL,NULL,'14e8fe380b27b5c82798ac1faee4b4ced145ddca',NULL),(27,NULL,'Lao Shanghai Town God s Temple Food','ä¸Šå›­æ‘ç”²4å·, Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0@`2å]@^œøjGùC@',NULL,NULL,'3766201f67f40c7768159fe842d7b2bccd1a2623',NULL),(28,NULL,'Jitian Weidao','Dahuisi Rd, Haidian','\0\0\0\0\0\0\0à<œÀt]@=~oÓùC@',NULL,NULL,'8a35d0e5f4ad0222a6bdc29dbc4cec431c0f89eb',NULL),(29,NULL,'Hongyun Tianwaitian Roast Duck Home Cooking','é«˜ç²±æ¡¥æ–œè¡—19å·, Qixiang Rd, Haidian','\0\0\0\0\0\0\0 óÎ]@dY0ñGùC@',NULL,NULL,'a83fb8bb35e7290c7e1079cee49829f92fb97879',NULL),(30,NULL,'é”…åº•æ','é«˜æ¢æ¡¥æ–œè¡—28å·, Haidian, Beijing','\0\0\0\0\0\0\0½ÅÃ]@\"ÁT3kùC@',NULL,NULL,'03e56d7d19cd1375905e278a08757de99b886e4d',NULL),(31,NULL,'é“é”…ç‚–æ±Ÿé±¼','é«˜ç²±æ¡¥æ–œè¡—28å·ï¼ˆè¿‘åŒ—æ–¹äº¤å¤§å—é—¨ï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0Ğ{œiÂ]@?rkÒmùC@',NULL,NULL,'99167c1e451f174dce393f6ca1b297bbd3fd0cf8',NULL),(32,NULL,'å››å‘½é™¢','é«˜ç²±æ¡¥æ–œè¡—19å·, Haidian, Beijing','\0\0\0\0\0\0\0øäa¡Ö]@r£ÈZCùC@',NULL,NULL,'7c9c469a17053d5fa5ab860dd2003512fd2e40f6',NULL),(33,NULL,'å‘³å£å…¨é¥ºå­ä¸²å¤§æŸ³æ ‘åº—','5 Daliushu Rd, Haidian','\0\0\0\0\0\0\0HPüs]@,œ¤ùcúC@',NULL,NULL,'b2a2339d8508c71627001e4b5815bfc3da292e97',NULL),(34,NULL,'Guolin Home Cooking Beixiaguan Shop','19 Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0\'0Ö]@&:Ë,BùC@',NULL,NULL,'ab12a8d60538a1299ab023c799e4daf69ec9a040',NULL),(35,NULL,'æ–°ç–†ç¾é£ŸåŸé«˜æ¢æ¡¥æ–œè¡—','é«˜æ¢æ¡¥æ–œè¡—, Haidian, Beijing','\0\0\0\0\0\0\0ÈÒÁú]@¤U-é(ùC@',NULL,NULL,'c90231ed34f4de78410468a478ba930ca1cc00bc',NULL),(36,NULL,'æ±Ÿè¾¹è¯±æƒ‘å·«å±±çƒ¤å…¨é±¼äº¤å¤§åº—','Haidian, Beijing','\0\0\0\0\0\0\0¸j#ò]@çş—kùC@',NULL,NULL,'b165976ca3450e994c6f10666839e630250ffbcc',NULL),(37,NULL,'Yinhe Outer Club','13 Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0 ²º]@¤\Zö{bùC@',NULL,NULL,'4b424d55d33f8fd0aab45422cc52c4307fa4e733',NULL),(38,NULL,'ä¸­å›½æ”¿æ³•å¤§å­¦æ³•å®¶æ¥¼é¥­åº„','å¤§æ…§å¯ºè·¯2å·, Haidian, Beijing','\0\0\0\0\0\0\0È{ÕÊ„]@c^G²ùC@',NULL,NULL,'2c83fc8043a18c49c3f45b55a66423d6c1a4971f',NULL),(39,NULL,'Yudu Jiachu Wanzhou Roasted Fish','19 Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0 ıöuà]@…%P6ùC@',NULL,NULL,'04f02b0326e8ec51150b3781c5be9f7fadcc0445',NULL),(40,NULL,'Yudouji Soybean Milk Yuhuoguo','Dahuisi Rd, Haidian','\0\0\0\0\0\0\0`¸u]@*˜ÙçùC@',NULL,NULL,'fb8c43976009ce4f51e1d9ec5db59b07c50aa873',NULL),(41,NULL,'è´¢å›­é¤å…','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL,'2b803a25921c8ea548f73f14da64927e86639f9a',NULL),(42,NULL,'å››åˆé™¢ç¾Šèå­é«˜æ¢æ¡¥åº—','é«˜æ¢æ¡¥æ–œè¡—19å·, Haidian, Beijing','\0\0\0\0\0\0\0ø™³>å]@+j0ùC@',NULL,NULL,'df13aa74d4b83b60b42f85efc976148d5ceb64e8',NULL),(43,NULL,'åŒ—äº¬å¸‚æ˜†é¹å½±è§†æŠ€æœ¯å…¬å¸è‹‘ä¸Šå›­ç¾é£ŸåŸ','è¥¿å¤–é«˜æ¢æ¡¥æ–œè¡—19å·, Haidian, Beijing','\0\0\0\0\0\0\0˜*•Ô]@ë;¿(AùC@',NULL,NULL,'1335c0d31dab37e419d95ea48347d20590ad909b',NULL),(44,NULL,'è€åƒå®¢åæ¨ªåº—','å¤§æŸ³æ ‘è·¯, Haidian, Beijing','\0\0\0\0\0\0\005#ƒ]@Aï!\0úC@',NULL,NULL,'d273b1b9ec7e41366fb0279f208159f64f7ab815',NULL),(45,NULL,'Ladangjia','62 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0€¸«W‘]@ø6ıÙúC@',NULL,NULL,'0e7c84b90330fa5f0c36a4d4cbf25d76bd12864e',NULL),(46,NULL,'Northeast Sanjiang Huoyu Cun','Gaoliangqiao Byway, Haidian','\0\0\0\0\0\0\0ˆ\nÕÍÅ]@;QiùC@',NULL,NULL,'1f2e7c15a6e035766efb4587d2a5aceb9a72228a',NULL),(47,NULL,'ç´«ç‰æ —å­','Xueyuan South Rd','\0\0\0\0\0\0\0°|–çÁ]@¦í_YiúC@',NULL,NULL,'b20ff7af381a61ebf74f4e612754ac0dab21a18f',NULL),(48,NULL,'ç¾Šå©†å©†ç«é”…','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0pdùƒ]@Ÿ«­Ø_úC@',NULL,NULL,'d677addac84f47cd2ed208e69c26948f3bfe30f6',NULL),(49,NULL,'èœ€æºå°è‚¥ç¾Š','é«˜æ¢æ¡¥æ–œè¡—ç”²22å·,åŒ—äº¬äº¤é€šå¤§å­¦è¥¿é—¨ä»¥å—130ç±³è·¯ä¸œ, Haidian, Beijing','\0\0\0\0\0\0\0ğ³‘ë¦]@3¦`ùC@',NULL,NULL,'6a916ba27106e08109900f920b44b16fb9fc33f6',NULL),(50,NULL,'é¼å¥½ä¸€ç¢—é¦™24å°æ—¶é¢é¦†','é«˜æ¢æ¡¥æ–œè¡—17å·å¤©å¤–å¤©çƒ¤é¸­å®¶æ—è¾¹, Haidian, Beijing','\0\0\0\0\0\0\0\0V-²]@ñ,AF@ùC@',NULL,NULL,'b176244e78da94f803aab9751abced46ac96d2f2',NULL),(51,NULL,'Baily Coffee American Restaurant','Daliushu Rd, Haidian','\0\0\0\0\0\0\0P¥Ÿpv]@¹p $úC@',NULL,NULL,'f38e757f447b1d12ad6a7c349d19a8aeafedc3eb',NULL),(52,NULL,'æ¢…è‹‘é¥­åº—ä¼‘é—²å¨±ä¹','è¥¿ç›´é—¨é«˜ç²±æ¡¥æ–œè¡—ç”²30å·, Haidian, Beijing','\0\0\0\0\0\0\0 Y2Ç]@ƒ1\"QhùC@',NULL,NULL,'8abeb268a3c2e4abaf7644274dacc177db831a6d',NULL),(53,NULL,'Renyi Restaurant','2 Dahuisi Rd, Haidian','\0\0\0\0\0\0\0Qew]@İïPèùC@',NULL,NULL,'14c2b6b9d827fa529adb914ebc631d0f50b40683',NULL),(54,NULL,'æ‹…ä»”å–œé¢','å¯Œæµ·å¤§å¦, Daliushu Rd, Haidian','\0\0\0\0\0\0\0°á\"÷t]@c—¨Ş\ZúC@',NULL,NULL,'4f6c07ff1581908dc392bcbd5338e6ad390dca55',NULL),(55,NULL,'å¯Œæµ·é“¶åº§æ—¥æœ¬æ–™ç†é“æ¿çƒ§èŒ¶è‰º','å¤§æŸ³æ ‘å¯Œæµ·ä¸­å¿ƒ3, Haidian, Beijing','\0\0\0\0\0\0\0 øßJv]@W{ØúC@',NULL,NULL,'0dd14694413105dd233305142571285fdaf65020',NULL),(56,NULL,'Suannaiwu','2 Dahuisi Rd, Haidian, Beijing','\0\0\0\0\0\0\0Üx]@å+”ØùC@',NULL,NULL,'442307d13313b3993ca2ac80435d50f901e33089',NULL),(57,NULL,'ä¹å¤´é¹°é…’å®¶é«˜æ¢æ¡¥åº—','é«˜æ¢æ¡¥æ–œè¡—ç”²22-3å·,åŒ—äº¬äº¤é€šå¤§å­¦è¥¿é—¨ä»¥å—120ç±³è·¯ä¸œ, Haidian, Beijing','\0\0\0\0\0\0\0Üº›§]@}—R—ŒùC@',NULL,NULL,'b27cb9457e4b8fe374bfbbd5e1798d088ad86809',NULL),(58,NULL,'å«å¥ç¾çƒ§çƒ¤åº—','é«˜æ¢æ¡¥ä¸Šå›­æ‘3å·, Haidian, Beijing','\0\0\0\0\0\0\0€LkÓØ]@†:¬pùC@',NULL,NULL,'c47fcfe72c6cf79f59ff00367b9e92e96e079522',NULL),(59,NULL,'Quik Convenience Store','åŒ—ä¸‹å…³, Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0€ºï]@™ñ¶ÒkùC@',NULL,NULL,'3d5ecc5aa0baf30b459581115d394db23f0aab5f',NULL),(60,NULL,'è€è¥¿åŒ—é¢é¦†','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL,'8080bb2e7532b16b5f8af36dcbb0d5304e1adc12',NULL),(61,NULL,'Wushan Roast Whole Fish','äº¤å¤§ä¸œè·¯46å·, Haidian','\0\0\0\0\0\0\0`‰”f]@Œ½_´ùC@',NULL,NULL,'bfbeb8fcc448a2294b0b9f0f57b4a11764148271',NULL),(62,NULL,'Jinhui International Business Conference Hotel','48 Xueyuan South Rd, Haidian, Beijing','\0\0\0\0\0\0\0¶¸Æg]@W\"PıƒúC@',NULL,NULL,'2472a241610a3aeb8e5f5c282f206f060ba6df17',NULL),(63,NULL,'Zhulu Tea House','36 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0\0­jI]@ê´nƒÚùC@',NULL,NULL,'93aca1d5df2efec45ba6a6179366a54cc57d4ea8',NULL),(64,NULL,'ç‰©ç¾ä¾¿åˆ©åº—äº¤é€šå¤§å­¦è·¯åº—','Haidian, Beijing','\0\0\0\0\0\0\0°ª\rN]@!“Œœ…ùC@',NULL,NULL,'168554f709aea747d42efd31a2ff8c531221e1e1',NULL),(65,NULL,'KFC','50 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0°Ø_vO]@æèñ{›úC@',NULL,NULL,'aa7b04548e890ce5ba154f912474f83477204b3a',NULL),(66,NULL,'Beijing Hualian','50 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0X\0S]@øSã¥›úC@',NULL,NULL,'a06c7f54f778aa174c466307141ea846d85c60a9',NULL),(67,NULL,'Lashangyin','äº¤é€šå¤§å­¦å—é—¨å‘ä¸œ200ç±³è·¯å—, Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\00µl­/]@ÍÃ¹†ùC@',NULL,NULL,'1f3bea78656029dfbfbc1a5724c9b74055353baa',NULL),(68,NULL,'McDonald\'s','å¤§æŸ³æ ‘è·¯2å·é™¢, Haidian','\0\0\0\0\0\0\09¶!]@•*Qö–úC@',NULL,NULL,'ac8063dd035d03d0a0adea846d351b7e8d47bf0d',NULL),(69,NULL,'Laobian Dumplings','äº¤é€šå¤§å­¦è·¯å—ä¾§, Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0ğ%Ñ:]@¥ö\"ÚùC@',NULL,NULL,'e755e5bc9ca94937787d39b785f93e7a929e2f9b',NULL),(70,NULL,'Shangbinzhai','äº¤å¤§ä¸œé—¨å¤–, Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0ÓL÷:]@_#IúC@',NULL,NULL,'3164dcdb705a4e15675615249b832e80a6f0d373',NULL),(71,NULL,'Weiduomei','åŒ—ä¸‹å…³, Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0p\\ìJ]@µ¨Or‡ùC@',NULL,NULL,'e8e873c43011cbe86aa8ae403f78535e868b06fb',NULL),(72,NULL,'No.9 Weidao Restaurant','9 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0Ğ¢>É]@8j…é{ùC@',NULL,NULL,'72c9aebfc0632167d4908cdaa03ccdf3a33bfdf5',NULL),(73,NULL,'Tube station','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','\0\0\0\0\0\0\0°Èè€$]@)	‰´ùC@',NULL,NULL,'adf54ac4baf4c45613dc50098f89125d131616d1',NULL),(74,NULL,'ç¥¥é¡ºå››åˆé™¢','é«˜ç²±æ¡¥æ–œè¡—19å·, Haidian, Beijing','\0\0\0\0\0\0\0 ¯Î1 ]@à€JùC@',NULL,NULL,'0061a6a2520266223653db95042dc4c92a5f044e',NULL),(75,NULL,'é¿é£å¡˜è¡—æ™¯ç”œå“é¥®æ–™å§','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','\0\0\0\0\0\0\0€\'f½]@ìQ¸…ùC@',NULL,NULL,'06e2d992200594cfe2a4e314f8828c708e7060df',NULL),(76,NULL,'ä¹–ä¹–æ¯…é¤å…','æ˜å…‰å¯º11å·, Haidian, Beijing','\0\0\0\0\0\0\0àÔ’w]@»)åµúC@',NULL,NULL,'1bf81500168c5958eb30176a0fcb1ebbf91339a5',NULL),(77,NULL,'Beijing Daoxiangcun Foodstuff Co.,Ltd.','60 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0È>È²`]@\"ü‹ 1ùC@',NULL,NULL,'fdee50090901d77d5d7d84391ad2ec0161ae5dc6',NULL),(78,NULL,'Fruitime','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0ĞJZñ\r]@õfÔ|ùC@',NULL,NULL,'a1b014ff4d8f0198dbc30bb46235e32cc31d373e',NULL),(79,NULL,'Dao Xiang Cun','60 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0˜8ò@d]@\'c`ùC@',NULL,NULL,'69acec215cef0992b6e45cc69a56f5c82eca4d99',NULL),(80,NULL,'Xiabu Xiabu','-1å·åè”å•†å¦1å±‚, 50 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0èLÚT]@™Kª¶›úC@',NULL,NULL,'d4bee7a3566cc8bd6dc4861d4b4a5eca7c925828',NULL),(81,NULL,'å‘¨é»‘é¸­','42 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0È1YÜ]@â<œúC@',NULL,NULL,'65f9a946d52960d997914deccbbb29c7ec51d567',NULL),(82,NULL,'å˜‰ç¦¾ä¸€å“äº¤å¤§ä¸œè·¯åº—','äº¤å¤§ä¸œè·¯25, Haidian, Beijing','\0\0\0\0\0\0\0P1AG]@”ùGß¤ùC@',NULL,NULL,'478ff24d07f126886e79259bb8e546b12de5b5b1',NULL),(83,NULL,'è¿ªäºšå¤©å¤©äº¤å¤§æŠ˜æ‰£è¶…å¸‚','60 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0˜8ò@d]@\'c`ùC@',NULL,NULL,'d58e21ed993678d74886a5ba80773432abbe8df6',NULL),(84,NULL,'è‚¯å¾·åŸºå­¦é™¢å—è·¯é¤å…','å­¦é™¢å—è·¯50-1, Haidian, Beijing','\0\0\0\0\0\0\0àÿ¨P]@¶dU„›úC@',NULL,NULL,'151cb48bef28bf70f219a42d9b77be6ae67f5b04',NULL),(85,NULL,'Liangjiang','Jiaotong Daxue Rd, Haidian, Beijing','\0\0\0\0\0\0\0X<]@XYÛùC@',NULL,NULL,'3dea60467574d084766d2517c8c5b86db97d931a',NULL),(86,NULL,'èµ›ç™¾å‘³','ä¸Šå›­æ‘3å·, Haidian, Beijing','\0\0\0\0\0\0\0Ğ.5]@%•)æ úC@',NULL,NULL,'a49e08ec95b1aa7fbe84941e40ad520a64c01496',NULL),(87,NULL,'7-Eleven','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0Ğtv28]@á(yuùC@',NULL,NULL,'8f909e65bb3664968ff52e97a95327b0d222765d',NULL),(88,NULL,'Yoshinoya','50 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0 @øP]@‡à¸Œ›úC@',NULL,NULL,'d7be8ac0ebccaeb82469eb4eb6edd4274f80a8e3',NULL),(89,NULL,'Dia','1 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\00\"1]@ğ÷‹Ù’ùC@',NULL,NULL,'74478ef0b27aea3684cab32a90ac7e84b41ff30c',NULL),(90,NULL,'Baijin Karaoke Square','25 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0>­¢?]@‘9¶ùC@',NULL,NULL,'0bf0b526332edbf694b47ca7e58f53a157c7719a',NULL),(91,NULL,'Jiahe Yipin Zhou','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0À}åA]@C;§Y ùC@',NULL,NULL,'621307a05752baf30cdf53cf3488866df231eea1',NULL),(92,NULL,'é©¬å…°æ‹‰é¢','1 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0€½‰!9]@\"—ùC@',NULL,NULL,'575694bfe1d5315827b66be270ee60b71e0e4c89',NULL),(93,NULL,'ä¹…ä¹…ä¸«','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','\0\0\0\0\0\0\0€uU ]@^-wf‚ùC@',NULL,NULL,'46052b5675141cdc35d39300821c227649507061',NULL),(94,NULL,'é¸¿é£é˜','é«˜ç²±æ¡¥æ–œè¡—, Haidian, Beijing','\0\0\0\0\0\0\0@Ñuá]@N%@ùC@',NULL,NULL,'ee0c13e24f10718d6dda340bf80c072259e78ab6',NULL),(95,NULL,'Yonho King','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0€Œ¹k	]@ÂmmáyùC@',NULL,NULL,'874b13ec1bfeeef9bcdd4f557061912ef3c78ff4',NULL),(96,NULL,'ç•…é¥®èŒ¶æ¥¼','äº¤å¤§ä¸œè·¯36å·, Haidian, Beijing','\0\0\0\0\0\0\0èÖkzP]@HlwĞùC@',NULL,NULL,'b0bda386fe5882e7f8dee3cc4b25fbf71695c5eb',NULL),(97,NULL,'ä¸Šæµ·åè”è¶…å¸‚','äº¤å¤§ä¸œè·¯, Haidian, Beijing','\0\0\0\0\0\0\0@c&Q/]@M…x$^úC@',NULL,NULL,'bbe19c4d9a728c30c09625af3d870cb1679cd2dd',NULL),(98,NULL,'æ¼«æ— ç›®çš„','äº¤é€šå¤§å­¦è·¯1å·é™¢4, Haidian, Beijing','\0\0\0\0\0\0\0Û$]@3¦`ùC@',NULL,NULL,'e23bb74b1a24836299bee869a79e12a8db4075b4',NULL),(99,NULL,'é‡‘å‡¤æˆç¥¥äº¤å¤§ä¸€åº—','Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0 Õw~Q]@ÚTİ#›ùC@',NULL,NULL,'0676bbe7e2c626afffd99ca02023a3fa27fd0c36',NULL),(100,NULL,'Beijing Jiaotong University ï¼ˆEast Campusï¼‰ Student Dining Hall','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0PŒeú%]@çş—kùC@',NULL,NULL,'b69706e056add3a126f0e854e0af43b7e7c9c394',NULL),(101,NULL,'Siyuan Qingsi','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0€Iññ	]@©…’É©ùC@',NULL,NULL,'d9b2c2c8a71359f8c83d8731cc8701e6d0b451ad',NULL),(102,NULL,'Wu Mart','31 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0`¶¶F]@\'…yùC@',NULL,NULL,'964ad01cc36065c2ee26b8486fdbddcd1fcbed15',NULL),(103,NULL,'Xiaoxiong Home','36 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0İAìL]@,z¤ÁùC@',NULL,NULL,'c57680de3f3a31687b54b491c31388f8db313bc8',NULL),(104,NULL,'å‹åœƒå’–å•¡','äº¤å¤§ä¸œè·¯1å·äº¤é€šå¤§å­¦é€¸å¤«æ¥¼3æ¥¼, Haidian, Beijing','\0\0\0\0\0\0\0Ğ¿$•)]@”Â¼Ç™úC@',NULL,NULL,'777c830ed59b078426e611c6718b65b18dea51ba',NULL),(105,NULL,'æ²™å¿å°åƒåŒ—äº¬äº¤å¤§ä¸œé—¨åº—','äº¤å¤§ä¸œè·¯, Haidian, Beijing','\0\0\0\0\0\0\0\0üSªD]@4J—şùC@',NULL,NULL,'bf26f230c5a9a1903cf22d19d209737ba47e52dd',NULL),(106,NULL,'å°æ¨æ¥¼ç§æˆ¿èœé¦†','52 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0`…”ŸT]@,¹ŠùC@',NULL,NULL,'9bcd3149d8646bacaba90f2c778ffaf098c6e11e',NULL),(107,NULL,'Xinfadi Baigewan ï¼ˆJiaodaï¼‰ Community Convenient Vegetable Shop','Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0 ğk$]@¡¡‚‹ùC@',NULL,NULL,'89f0714067d8fd4356c6be658d2acaf73bb768af',NULL),(108,NULL,'Chaoshifa Convenience Store','1 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0°]@D?{ùC@',NULL,NULL,'43f03f639a633e4278e37bdad6ac5728562d4bf0',NULL),(109,NULL,'Cå¹³æ–¹é…¸å¥¶åº—','äº¤é€šå¤§å­¦è·¯äº¤å¤§å®¶å›­5å·æ¥¼ï¼ˆè¾£å°šç˜¾çƒ¤é±¼å¯¹é¢ï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0à&£Ê0]@¤«‘ùC@',NULL,NULL,'2f16e4b194f3d249a79657e0e694ef6d3c469ce8',NULL),(110,NULL,'å­¦è‹‘é¤å…','åŒ—äº¬äº¤é€šå¤§å­¦æ ¡å¤–å…¬å¯“, Haidian, Beijing','\0\0\0\0\0\0\0xĞ}9]@I½§rÚùC@',NULL,NULL,'d45f6e0f495c3bda3dc1c87bb91f89507a2e8101',NULL),(111,NULL,'ç¦æˆè‚¥ç‰›å˜‰èŒ‚åº—','è¥¿ç›´é—¨å˜‰èŒ‚è´­ç‰©å¹¿åœºå››ã€äº”å±‚, Haidian, Beijing','\0\0\0\0\0\0\0èÆô„%]@“7ÀÌwúC@',NULL,NULL,'91a5cc4e0079a2d13f536ece95238b03a3753faa',NULL),(112,NULL,'æ ¡é—¨å£','åŒ—äº¬äº¤é€šå¤§å­¦å®¶å±åŒºï¼ˆä¸œé—¨ï¼‰, Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0@ëâ6]@Môù(#úC@',NULL,NULL,'28445879bd7b34ced193cd0894e4f29f29d1b78b',NULL),(113,NULL,'å¥½åƒåŠ','äº¤å¤§ä¸œè·¯17å·, Haidian, Beijing','\0\0\0\0\0\0\0Ø¶(³A]@ÙÎ÷SãùC@',NULL,NULL,'583195308c5d7ef63495d672c70b6ee276ad8718',NULL),(114,NULL,'å°šè†³å¤§é£Ÿå ‚','äº¤å¤§ä¸œè·¯ï¼ˆè¿‘ä½°é‡‘ktvï¼‰, Haidian, Beijing','\0\0\0\0\0\0\0À*ŞÈ<]@¼®_°úC@',NULL,NULL,'37243f3f36e1717980957693b5f3ef716bdb4703',NULL),(115,NULL,'Axiang Rice Noodles','48 Xueyuan South Rd, Haidian','\0\0\0\0\0\0\0P\0ş)U]@iÇ\r¿›úC@',NULL,NULL,'4fcbf90edea9ec2ef27509d1da368ea8c0805584',NULL),(116,NULL,'èç‹åºœç¾Šèå­','25 Jiaotong Daxue Rd, Haidian','\0\0\0\0\0\0\0(ˆº@]@äf¸ŸùC@',NULL,NULL,'117bafb30a2f3a380578d98ca0e5b877ee72e99f',NULL),(117,NULL,'æ–°ç–†ç¾é£ŸåŸ','å­¦é™¢å—è·¯27å·, Haidian, Beijing','\0\0\0\0\0\0\0ø•é)]@ş\n™+ƒúC@',NULL,NULL,'029a3b13120bf957ce6aa97f4d32fed5144867a8',NULL),(118,NULL,'é˜³å…‰ç¼˜æ—å’–å•¡äº¤å¤§åº—','Haidian, Beijing','\0\0\0\0\0\0\0ø²í´5]@¡¾eN—ùC@',NULL,NULL,'9577951c140419772e258efa7d98fd438d611dca',NULL),(119,NULL,'Tianfu Xiangguo','17 Jiaoda East Rd, Haidian','\0\0\0\0\0\0\0p\ZÛkA]@½á´àùC@',NULL,NULL,'719cda9132b4206302f04c6541f90eaf56a89e67',NULL),(120,NULL,'å®œå“å°è‚¥ç¾Š','è¥¿ç›´é—¨å¤–äº¤å¤§ä¸œè·¯, Haidian, Beijing','\0\0\0\0\0\0\0p4€·@]@VñFæùC@',NULL,NULL,'0deb9637455b190bd2a1723c28b7bd932bcd54cc',NULL);
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

-- Dump completed on 2014-05-11 23:14:27
