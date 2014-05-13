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
  `cust_joined_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cust_id`),
  UNIQUE KEY `cust_phoneno_UNIQUE` (`cust_phoneno`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_accounts`
--

LOCK TABLES `customer_accounts` WRITE;
/*!40000 ALTER TABLE `customer_accounts` DISABLE KEYS */;
INSERT INTO `customer_accounts` VALUES (1,'test','11122223333','pHsAfvHPAX547TBWMeiHHrRx+qn/ipTbno/wIT4A5962K4dVLRUv3yDtQ6qRJnYdIPYbKhKcti+91C1p3QB6o6HPtETdBfjfbDTipZ4w7hK2CFhBtuq/F1fGMwznFvxGvrl8RMRKOWTkvIPFOgPFdNaLQza+nUURvV5owBKzaUo4zT6AYI63kBJS54eZyGw9NNed3qZiz/e4Cga7RUKBfx5MFvaRLj5+PQlftErIltwdwzsB5fFhnQ0LKDas88EY1GrUX72TsojuotdQyOUSQgsYTgI1fjTU04doz0NBEQwwgwL0QMFZKPE/4ctDnUz5+AyLU+PJpLqNaJ6EK0vDTw==:FyIOqy7pYPLoSl+Kc0A/pv70dVignV/+lYGEz/NHETDQO+7mq8jIzv+N/LscJAkPcGs3mh/GmoxLG+S0s9FZuR8EBIRsUQil4wLuVH+77JFb+l7v/UGuOOiyecZ0zLcs6yXiN7PV3JE92UAkxkAvaHkBcQ3wstcrSbk77lABnN0=','2014-05-13 08:30:00'),(2,'foobar','12312341234','DpA3lN63BcPnPDNTq0t243b3wmgYHP0yeO2tQiIvgNu1Si7kb9smTE5jMDRe+scOrw9/MnympnGhdJWwsCQaCk47IYdWpBypceKpSQCgSiERTIXX55VKEbl+SZo+CIuREV4t/UELePh49kXVri2JcSjFwH6Z5qGgltwatHbMvBRnSKheAF8Q9KPdfzx6QJ441DBvVyzgpEs/8h8KrpauFR9xYa1OSmkvGhy5mroJSsDMDgNecM4o2AriqhuWdEnEgXtDpFWTZVa7la/ydYh3WNFmi4NEp/V2mq3yFTa6LF41p/r/Im6p2U2sO1/xLpQiHNMLOlUGK3EGAZ2j2ECYtQ==:YTAYd30VCq0LqMMqBu4uiVO0CKy5nen+9F/DD2Kv9qgnCP+Fq9d1X/Rd4ATJWq44mITF2GSUjsCswDoR6dJnJc57r1BPqb6z7cBBU1ba/AzxEFjrPy8RKUuVD/fHLKQshtG5p9R4vjFGdNIAwmeVJOF2EsVBWaJBTbebsfSCOIM=','2014-05-13 08:30:52'),(3,'john','12301230123','GZkk77Vi1IyFJT8wFjmYUxM+Opvxm5QCG194i8RWCZAxveUTLDg++fHZ8VQfFGDpskZoPALIVO7Ew5Ehfdv/sxQzwa34x/f139ikPLMxhdBJSZac9CC5RrJISNI4PvtXoHWAgq2FWffyhiSVxsv852zzD1NCeTLBw/Is1M+6BLFkBWfJ0nblYoE8b/sX/iqjTkvhu5oGm+N5rTwnHp8aFw6BHOcjN2VdTXgQsVUR6mvsu0A45W/mycU6ZEjBC2npJqSiLEQI19uNUcmjklBosHg5+RtJKPHtsKZyAEVgzQEEAF9JwMuPpfJwdEJFCmtPChp9e9NijhxzCgGDOAPqlw==:C7ux2/Vf3gvgyRiEcCILEUG82alAlyV6/9nGdDAhxLq7Um5v8HjKohVSZokgdqikTb7jw/uinbiZ6ze8MC3ugLT9HIPT+2ryiwqxiE43FE1TqONXLvq6lH2wFhkPG/jAZW7sR2LTsC8FwxdvyY+dSpd2W2N09wVeuNdyrrutSRw=','2014-05-13 08:36:45');
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
  `tbl_display_number` int(11) NOT NULL,
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
  `inv_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inv_status` char(1) NOT NULL,
  PRIMARY KEY (`inv_id`,`inv_cust_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` VALUES (1,1,1,'true','2014-05-13 08:32:48','s'),(1,2,1,'false','2014-05-13 08:32:48','s'),(1,3,1,'false','2014-05-13 08:32:48','s');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,'Big Mac',18.00,3),(2,1,'Big Mac 2',20.00,1);
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
  `o_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `o_updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`o_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,74.00,3,'2014-05-05',1,'',1,'2014-05-13 08:32:48','0000-00-00 00:00:00');
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
  `ra_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ra_id`),
  UNIQUE KEY `ra_name_UNIQUE` (`ra_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_accounts`
--

LOCK TABLES `restaurant_accounts` WRITE;
/*!40000 ALTER TABLE `restaurant_accounts` DISABLE KEYS */;
INSERT INTO `restaurant_accounts` VALUES (1,'admin','QLwr3+/NMuHF8gjiJ/nD78MnNbjbEJxHLGT2PIdHT+IDFycOsCY6+qBJ4QUcsjSBXk43s+iVUdJPz+BueMldyOhTR96q/qHoT0oUr+70j+NBFkQwwA24IWGqG7glYdrNpcG00So7c+G/fgjd3paq38SUyXVrfgt4i5rh50qllVVTuDZ82Wt4IB54LXQ6J1fOZaD4iU53lnmubZsflAGt7V80ucQx8gCTIEz33hMY3yV8jXo5dlWsVKjkAiKOkkQ0jBeThyTKZPFOziVh5y/aWbOlHLhYARSI1Hx9yEjeu/eahWGBZEVdDYo0pj1vWoMilDjTitKP9D0s3XJ41yd8Sg==:DhAE3T9vV1uzKWf/2BcfDodC/bPKFXp02VLHdpJSG2fgNpQu/5Ueg8pv9B2Rn9Jjhbef6cu4J+k7WnQ75sC01xhZ6/wExkAbCm3aEjblZEf1dBttjOPmI0Brmbw/9XjD0lhJFlMUWqONlLm76l7ieR6df/1x+8UBFqxZstI1PgU=','2014-05-12 14:15:09');
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
  `rest_category` varchar(255) NOT NULL,
  `rest_geo_location` point DEFAULT NULL,
  `rest_pic` varchar(255) DEFAULT NULL,
  `rest_pic_thumb` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,NULL,'Jiayuan Hotel','6 Daliushu Rd, Haidian','','\0\0\0\0\0\0\00u×ƒ]@èô¼úC@',NULL,NULL),(2,NULL,'Shangyuan Hotel','40 Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\00PR`]@¡¹N#-ùC@',NULL,NULL),(3,NULL,'Hongguoyuan Hotel','è¥¿ç›´é—¨å¤–ä¸Šå›­æ‘3å·åŒ—æ–¹äº¤å¤§é™¢å†…, Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0¨Ì?ú]@ßú°Ş¨ùC@',NULL,NULL),(4,NULL,'Beijing Jiaotong University Student Er Restaurant','15 Gaoliangqiao Byway, Haidian, Beijing','','\0\0\0\0\0\0\0°F=D£]@ÿé\n¼ùC@',NULL,NULL),(5,NULL,'Lingering Garden','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0BÎûÿ]@Üğ»é–ùC@',NULL,NULL),(6,NULL,'é™æ€ç´ é£ŸåŠ','é«˜ç²±æ¡¥æ–œè¡—ç”²30å·æ¢…è‹‘é¥­åº—1-2æ¥¼ï¼ˆè¿‘äº¤é€šå¤§å­¦å—é—¨ï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0àŸR%Ê]@é*İ]gùC@',NULL,NULL),(7,NULL,'åŒ—äº¬å’Œåº­é¤é¥®','é«˜æ¢æ¡¥æ–œè¡—18å·ä¸­è‹‘å®¾é¦†ä¸€å±‚, Haidian, Beijing','','\0\0\0\0\0\0\0Ğfœ†¨]@Ÿ`<ùC@',NULL,NULL),(8,NULL,'Sankeshu','å¤ªå¹³åº„13å·, Qixiang Rd, Haidian','','\0\0\0\0\0\0\0Ğ!©…’]@Um7Á7ùC@',NULL,NULL),(9,NULL,'ç§‘è‹‘é¤å…','2 Daliushu Rd, Haidian','','\0\0\0\0\0\0\0PËH½§]@8ù-:YúC@',NULL,NULL),(10,NULL,'ä¹å¤©ç›ç‰¹','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL),(11,NULL,'é‚“è€å‡‰èŒ¶','å¤§æŸ³æ ‘å—ç«™åŒ—æ–¹äº¤å¤§è¥¿é—¨å¯¹é¢, Haidian, Beijing','','\0\0\0\0\0\0\0€¹İË}]@¿¸T¥-úC@',NULL,NULL),(12,NULL,'Golden Phoenix','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0@—©Iğ]@Q§“lùC@',NULL,NULL),(13,NULL,'7-Eleven','Daliushu Rd, Haidian','','\0\0\0\0\0\0\0@nøİt]@Ï‡g	2úC@',NULL,NULL),(14,NULL,'å¤§èŒ¶æ¯','3 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0 rL÷]@ŠsÔÑqùC@',NULL,NULL),(15,NULL,'ç–¯ç‹‚çƒ¤ç¿…','é«˜æ¢æ¡¥æ–œè¡—ï¼ˆäº¤é€šå¤§å­¦å—é—¨å¯¹é¢ï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0pBZcĞ]@h>çnùC@',NULL,NULL),(16,NULL,'Fruitime','23 Daliushu Rd, Haidian','','\0\0\0\0\0\0\0À‡-y]@®ğ.ñùC@',NULL,NULL),(17,NULL,'é‡‘å‡¤æˆç¥¥','å†œå¤§ä¸œè·¯ä¸Šåœ°åè”è¶…å¸‚B1æ¥¼14å·ï¼ˆè¿‘ä¸Šåœ°å—å£ï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0 ™Õ;Ü]@ø¬8ùC@',NULL,NULL),(18,NULL,'åŒ—äº¬æ¯”å¤šå¿«é¤æœ‰é™å…¬å¸','ä¸Šå›­æ‘32å·, Haidian, Beijing','','\0\0\0\0\0\0\0¸šuÆ÷]@^ÖÄ_ùC@',NULL,NULL),(19,NULL,'é‡‘å‡¤æˆç¥¥äº¤å¤§äºŒåº—','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0p€™ïà]@^Iò\\ùC@',NULL,NULL),(20,NULL,'é²œæœæ—¶å…‰','é«˜ç²±æ¡¥æ–œè¡—1å·èŸ¹è€å®‹é¦™é”…å¯¹é¢ï¼ˆè¿‘å¤§æ…§å¯ºï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0cëÂ]@üà|êXùC@',NULL,NULL),(21,NULL,'ä¸‰å…ƒæ¢…å›­ä¹³å“åº—','Jiaotong Daxue Rd','','\0\0\0\0\0\0\0`Êùbï]@é\r÷‘[ùC@',NULL,NULL),(22,NULL,'Golden Phoenix','Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0ø g³ê]@§ÉŒ·•úC@',NULL,NULL),(23,NULL,'Niushiniu','2 Dahuisi Rd, Haidian','','\0\0\0\0\0\0\0â‘xy]@ÂøiÜùC@',NULL,NULL),(24,NULL,'ç”œå“æ—¶é—´','2 Daliushu Rd, Haidian','','\0\0\0\0\0\0\0PËH½§]@8ù-:YúC@',NULL,NULL),(25,NULL,'Nadu Spicy-hot Hotpot','Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0ğÕÇCß]@r†â7ùC@',NULL,NULL),(26,NULL,'é«˜ä¸½ç‹æœé…±æ±¤ç‰›æ’ç«é”…','Haidian, Beijing','','\0\0\0\0\0\0\0€\nG]@ÖÈ®´ŒúC@',NULL,NULL),(27,NULL,'Lao Shanghai Town God s Temple Food','ä¸Šå›­æ‘ç”²4å·, Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0@`2å]@^œøjGùC@',NULL,NULL),(28,NULL,'Jitian Weidao','Dahuisi Rd, Haidian','','\0\0\0\0\0\0\0à<œÀt]@=~oÓùC@',NULL,NULL),(29,NULL,'Hongyun Tianwaitian Roast Duck Home Cooking','é«˜ç²±æ¡¥æ–œè¡—19å·, Qixiang Rd, Haidian','','\0\0\0\0\0\0\0 óÎ]@dY0ñGùC@',NULL,NULL),(30,NULL,'é”…åº•æ','é«˜æ¢æ¡¥æ–œè¡—28å·, Haidian, Beijing','','\0\0\0\0\0\0\0½ÅÃ]@\"ÁT3kùC@',NULL,NULL),(31,NULL,'é“é”…ç‚–æ±Ÿé±¼','é«˜ç²±æ¡¥æ–œè¡—28å·ï¼ˆè¿‘åŒ—æ–¹äº¤å¤§å—é—¨ï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0Ğ{œiÂ]@?rkÒmùC@',NULL,NULL),(32,NULL,'å››å‘½é™¢','é«˜ç²±æ¡¥æ–œè¡—19å·, Haidian, Beijing','','\0\0\0\0\0\0\0øäa¡Ö]@r£ÈZCùC@',NULL,NULL),(33,NULL,'å‘³å£å…¨é¥ºå­ä¸²å¤§æŸ³æ ‘åº—','5 Daliushu Rd, Haidian','','\0\0\0\0\0\0\0HPüs]@,œ¤ùcúC@',NULL,NULL),(34,NULL,'Guolin Home Cooking Beixiaguan Shop','19 Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0\'0Ö]@&:Ë,BùC@',NULL,NULL),(35,NULL,'æ–°ç–†ç¾é£ŸåŸé«˜æ¢æ¡¥æ–œè¡—','é«˜æ¢æ¡¥æ–œè¡—, Haidian, Beijing','','\0\0\0\0\0\0\0ÈÒÁú]@¤U-é(ùC@',NULL,NULL),(36,NULL,'æ±Ÿè¾¹è¯±æƒ‘å·«å±±çƒ¤å…¨é±¼äº¤å¤§åº—','Haidian, Beijing','','\0\0\0\0\0\0\0¸j#ò]@çş—kùC@',NULL,NULL),(37,NULL,'Yinhe Outer Club','13 Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0 ²º]@¤\Zö{bùC@',NULL,NULL),(38,NULL,'ä¸­å›½æ”¿æ³•å¤§å­¦æ³•å®¶æ¥¼é¥­åº„','å¤§æ…§å¯ºè·¯2å·, Haidian, Beijing','','\0\0\0\0\0\0\0È{ÕÊ„]@c^G²ùC@',NULL,NULL),(39,NULL,'Yudu Jiachu Wanzhou Roasted Fish','19 Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0 ıöuà]@…%P6ùC@',NULL,NULL),(40,NULL,'Yudouji Soybean Milk Yuhuoguo','Dahuisi Rd, Haidian','','\0\0\0\0\0\0\0`¸u]@*˜ÙçùC@',NULL,NULL),(41,NULL,'è´¢å›­é¤å…','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL),(42,NULL,'å››åˆé™¢ç¾Šèå­é«˜æ¢æ¡¥åº—','é«˜æ¢æ¡¥æ–œè¡—19å·, Haidian, Beijing','','\0\0\0\0\0\0\0ø™³>å]@+j0ùC@',NULL,NULL),(43,NULL,'åŒ—äº¬å¸‚æ˜†é¹å½±è§†æŠ€æœ¯å…¬å¸è‹‘ä¸Šå›­ç¾é£ŸåŸ','è¥¿å¤–é«˜æ¢æ¡¥æ–œè¡—19å·, Haidian, Beijing','','\0\0\0\0\0\0\0˜*•Ô]@ë;¿(AùC@',NULL,NULL),(44,NULL,'è€åƒå®¢åæ¨ªåº—','å¤§æŸ³æ ‘è·¯, Haidian, Beijing','','\0\0\0\0\0\0\005#ƒ]@Aï!\0úC@',NULL,NULL),(45,NULL,'Ladangjia','62 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0€¸«W‘]@ø6ıÙúC@',NULL,NULL),(46,NULL,'Northeast Sanjiang Huoyu Cun','Gaoliangqiao Byway, Haidian','','\0\0\0\0\0\0\0ˆ\nÕÍÅ]@;QiùC@',NULL,NULL),(47,NULL,'ç´«ç‰æ —å­','Xueyuan South Rd','','\0\0\0\0\0\0\0°|–çÁ]@¦í_YiúC@',NULL,NULL),(48,NULL,'ç¾Šå©†å©†ç«é”…','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0pdùƒ]@Ÿ«­Ø_úC@',NULL,NULL),(49,NULL,'èœ€æºå°è‚¥ç¾Š','é«˜æ¢æ¡¥æ–œè¡—ç”²22å·,åŒ—äº¬äº¤é€šå¤§å­¦è¥¿é—¨ä»¥å—130ç±³è·¯ä¸œ, Haidian, Beijing','','\0\0\0\0\0\0\0ğ³‘ë¦]@3¦`ùC@',NULL,NULL),(50,NULL,'é¼å¥½ä¸€ç¢—é¦™24å°æ—¶é¢é¦†','é«˜æ¢æ¡¥æ–œè¡—17å·å¤©å¤–å¤©çƒ¤é¸­å®¶æ—è¾¹, Haidian, Beijing','','\0\0\0\0\0\0\0\0V-²]@ñ,AF@ùC@',NULL,NULL),(51,NULL,'Baily Coffee American Restaurant','Daliushu Rd, Haidian','','\0\0\0\0\0\0\0P¥Ÿpv]@¹p $úC@',NULL,NULL),(52,NULL,'æ¢…è‹‘é¥­åº—ä¼‘é—²å¨±ä¹','è¥¿ç›´é—¨é«˜ç²±æ¡¥æ–œè¡—ç”²30å·, Haidian, Beijing','','\0\0\0\0\0\0\0 Y2Ç]@ƒ1\"QhùC@',NULL,NULL),(53,NULL,'Renyi Restaurant','2 Dahuisi Rd, Haidian','','\0\0\0\0\0\0\0Qew]@İïPèùC@',NULL,NULL),(54,NULL,'æ‹…ä»”å–œé¢','å¯Œæµ·å¤§å¦, Daliushu Rd, Haidian','','\0\0\0\0\0\0\0°á\"÷t]@c—¨Ş\ZúC@',NULL,NULL),(55,NULL,'å¯Œæµ·é“¶åº§æ—¥æœ¬æ–™ç†é“æ¿çƒ§èŒ¶è‰º','å¤§æŸ³æ ‘å¯Œæµ·ä¸­å¿ƒ3, Haidian, Beijing','','\0\0\0\0\0\0\0 øßJv]@W{ØúC@',NULL,NULL),(56,NULL,'Suannaiwu','2 Dahuisi Rd, Haidian, Beijing','','\0\0\0\0\0\0\0Üx]@å+”ØùC@',NULL,NULL),(57,NULL,'ä¹å¤´é¹°é…’å®¶é«˜æ¢æ¡¥åº—','é«˜æ¢æ¡¥æ–œè¡—ç”²22-3å·,åŒ—äº¬äº¤é€šå¤§å­¦è¥¿é—¨ä»¥å—120ç±³è·¯ä¸œ, Haidian, Beijing','','\0\0\0\0\0\0\0Üº›§]@}—R—ŒùC@',NULL,NULL),(58,NULL,'å«å¥ç¾çƒ§çƒ¤åº—','é«˜æ¢æ¡¥ä¸Šå›­æ‘3å·, Haidian, Beijing','','\0\0\0\0\0\0\0€LkÓØ]@†:¬pùC@',NULL,NULL),(59,NULL,'Quik Convenience Store','åŒ—ä¸‹å…³, Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0€ºï]@™ñ¶ÒkùC@',NULL,NULL),(60,NULL,'è€è¥¿åŒ—é¢é¦†','ä¸­å¤®è´¢ç»å¤§å­¦å­¦ç”Ÿå®¿èˆåŒº, 62 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0Ø{L¤]@vŒ+.úC@',NULL,NULL),(61,NULL,'Wushan Roast Whole Fish','äº¤å¤§ä¸œè·¯46å·, Haidian','','\0\0\0\0\0\0\0`‰”f]@Œ½_´ùC@',NULL,NULL),(62,NULL,'Jinhui International Business Conference Hotel','48 Xueyuan South Rd, Haidian, Beijing','','\0\0\0\0\0\0\0¶¸Æg]@W\"PıƒúC@',NULL,NULL),(63,NULL,'Zhulu Tea House','36 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0\0­jI]@ê´nƒÚùC@',NULL,NULL),(64,NULL,'ç‰©ç¾ä¾¿åˆ©åº—äº¤é€šå¤§å­¦è·¯åº—','Haidian, Beijing','','\0\0\0\0\0\0\0°ª\rN]@!“Œœ…ùC@',NULL,NULL),(65,NULL,'KFC','50 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0°Ø_vO]@æèñ{›úC@',NULL,NULL),(66,NULL,'Beijing Hualian','50 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0X\0S]@øSã¥›úC@',NULL,NULL),(67,NULL,'Lashangyin','äº¤é€šå¤§å­¦å—é—¨å‘ä¸œ200ç±³è·¯å—, Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\00µl­/]@ÍÃ¹†ùC@',NULL,NULL),(68,NULL,'McDonald\'s','å¤§æŸ³æ ‘è·¯2å·é™¢, Haidian','','\0\0\0\0\0\0\09¶!]@•*Qö–úC@',NULL,NULL),(69,NULL,'Laobian Dumplings','äº¤é€šå¤§å­¦è·¯å—ä¾§, Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0ğ%Ñ:]@¥ö\"ÚùC@',NULL,NULL),(70,NULL,'Shangbinzhai','äº¤å¤§ä¸œé—¨å¤–, Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0ÓL÷:]@_#IúC@',NULL,NULL),(71,NULL,'Weiduomei','åŒ—ä¸‹å…³, Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0p\\ìJ]@µ¨Or‡ùC@',NULL,NULL),(72,NULL,'No.9 Weidao Restaurant','9 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0Ğ¢>É]@8j…é{ùC@',NULL,NULL),(73,NULL,'Tube station','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','','\0\0\0\0\0\0\0°Èè€$]@)	‰´ùC@',NULL,NULL),(74,NULL,'ç¥¥é¡ºå››åˆé™¢','é«˜ç²±æ¡¥æ–œè¡—19å·, Haidian, Beijing','','\0\0\0\0\0\0\0 ¯Î1 ]@à€JùC@',NULL,NULL),(75,NULL,'é¿é£å¡˜è¡—æ™¯ç”œå“é¥®æ–™å§','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','','\0\0\0\0\0\0\0€\'f½]@ìQ¸…ùC@',NULL,NULL),(76,NULL,'ä¹–ä¹–æ¯…é¤å…','æ˜å…‰å¯º11å·, Haidian, Beijing','','\0\0\0\0\0\0\0àÔ’w]@»)åµúC@',NULL,NULL),(77,NULL,'Beijing Daoxiangcun Foodstuff Co.,Ltd.','60 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0È>È²`]@\"ü‹ 1ùC@',NULL,NULL),(78,NULL,'Fruitime','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0ĞJZñ\r]@õfÔ|ùC@',NULL,NULL),(79,NULL,'Dao Xiang Cun','60 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0˜8ò@d]@\'c`ùC@',NULL,NULL),(80,NULL,'Xiabu Xiabu','-1å·åè”å•†å¦1å±‚, 50 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0èLÚT]@™Kª¶›úC@',NULL,NULL),(81,NULL,'å‘¨é»‘é¸­','42 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0È1YÜ]@â<œúC@',NULL,NULL),(82,NULL,'å˜‰ç¦¾ä¸€å“äº¤å¤§ä¸œè·¯åº—','äº¤å¤§ä¸œè·¯25, Haidian, Beijing','','\0\0\0\0\0\0\0P1AG]@”ùGß¤ùC@',NULL,NULL),(83,NULL,'è¿ªäºšå¤©å¤©äº¤å¤§æŠ˜æ‰£è¶…å¸‚','60 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0˜8ò@d]@\'c`ùC@',NULL,NULL),(84,NULL,'è‚¯å¾·åŸºå­¦é™¢å—è·¯é¤å…','å­¦é™¢å—è·¯50-1, Haidian, Beijing','','\0\0\0\0\0\0\0àÿ¨P]@¶dU„›úC@',NULL,NULL),(85,NULL,'Liangjiang','Jiaotong Daxue Rd, Haidian, Beijing','','\0\0\0\0\0\0\0X<]@XYÛùC@',NULL,NULL),(86,NULL,'èµ›ç™¾å‘³','ä¸Šå›­æ‘3å·, Haidian, Beijing','','\0\0\0\0\0\0\0Ğ.5]@%•)æ úC@',NULL,NULL),(87,NULL,'7-Eleven','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0Ğtv28]@á(yuùC@',NULL,NULL),(88,NULL,'Yoshinoya','50 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0 @øP]@‡à¸Œ›úC@',NULL,NULL),(89,NULL,'Dia','1 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\00\"1]@ğ÷‹Ù’ùC@',NULL,NULL),(90,NULL,'Baijin Karaoke Square','25 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0>­¢?]@‘9¶ùC@',NULL,NULL),(91,NULL,'Jiahe Yipin Zhou','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0À}åA]@C;§Y ùC@',NULL,NULL),(92,NULL,'é©¬å…°æ‹‰é¢','1 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0€½‰!9]@\"—ùC@',NULL,NULL),(93,NULL,'ä¹…ä¹…ä¸«','äº¤é€šå¤§å­¦è·¯, Haidian, Beijing','','\0\0\0\0\0\0\0€uU ]@^-wf‚ùC@',NULL,NULL),(94,NULL,'é¸¿é£é˜','é«˜ç²±æ¡¥æ–œè¡—, Haidian, Beijing','','\0\0\0\0\0\0\0@Ñuá]@N%@ùC@',NULL,NULL),(95,NULL,'Yonho King','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0€Œ¹k	]@ÂmmáyùC@',NULL,NULL),(96,NULL,'ç•…é¥®èŒ¶æ¥¼','äº¤å¤§ä¸œè·¯36å·, Haidian, Beijing','','\0\0\0\0\0\0\0èÖkzP]@HlwĞùC@',NULL,NULL),(97,NULL,'ä¸Šæµ·åè”è¶…å¸‚','äº¤å¤§ä¸œè·¯, Haidian, Beijing','','\0\0\0\0\0\0\0@c&Q/]@M…x$^úC@',NULL,NULL),(98,NULL,'æ¼«æ— ç›®çš„','äº¤é€šå¤§å­¦è·¯1å·é™¢4, Haidian, Beijing','','\0\0\0\0\0\0\0Û$]@3¦`ùC@',NULL,NULL),(99,NULL,'é‡‘å‡¤æˆç¥¥äº¤å¤§ä¸€åº—','Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0 Õw~Q]@ÚTİ#›ùC@',NULL,NULL),(100,NULL,'Beijing Jiaotong University ï¼ˆEast Campusï¼‰ Student Dining Hall','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0PŒeú%]@çş—kùC@',NULL,NULL),(101,NULL,'Siyuan Qingsi','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0€Iññ	]@©…’É©ùC@',NULL,NULL),(102,NULL,'Wu Mart','31 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0`¶¶F]@\'…yùC@',NULL,NULL),(103,NULL,'Xiaoxiong Home','36 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0İAìL]@,z¤ÁùC@',NULL,NULL),(104,NULL,'å‹åœƒå’–å•¡','äº¤å¤§ä¸œè·¯1å·äº¤é€šå¤§å­¦é€¸å¤«æ¥¼3æ¥¼, Haidian, Beijing','','\0\0\0\0\0\0\0Ğ¿$•)]@”Â¼Ç™úC@',NULL,NULL),(105,NULL,'æ²™å¿å°åƒåŒ—äº¬äº¤å¤§ä¸œé—¨åº—','äº¤å¤§ä¸œè·¯, Haidian, Beijing','','\0\0\0\0\0\0\0\0üSªD]@4J—şùC@',NULL,NULL),(106,NULL,'å°æ¨æ¥¼ç§æˆ¿èœé¦†','52 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0`…”ŸT]@,¹ŠùC@',NULL,NULL),(107,NULL,'Xinfadi Baigewan ï¼ˆJiaodaï¼‰ Community Convenient Vegetable Shop','Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0 ğk$]@¡¡‚‹ùC@',NULL,NULL),(108,NULL,'Chaoshifa Convenience Store','1 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0°]@D?{ùC@',NULL,NULL),(109,NULL,'Cå¹³æ–¹é…¸å¥¶åº—','äº¤é€šå¤§å­¦è·¯äº¤å¤§å®¶å›­5å·æ¥¼ï¼ˆè¾£å°šç˜¾çƒ¤é±¼å¯¹é¢ï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0à&£Ê0]@¤«‘ùC@',NULL,NULL),(110,NULL,'å­¦è‹‘é¤å…','åŒ—äº¬äº¤é€šå¤§å­¦æ ¡å¤–å…¬å¯“, Haidian, Beijing','','\0\0\0\0\0\0\0xĞ}9]@I½§rÚùC@',NULL,NULL),(111,NULL,'ç¦æˆè‚¥ç‰›å˜‰èŒ‚åº—','è¥¿ç›´é—¨å˜‰èŒ‚è´­ç‰©å¹¿åœºå››ã€äº”å±‚, Haidian, Beijing','','\0\0\0\0\0\0\0èÆô„%]@“7ÀÌwúC@',NULL,NULL),(112,NULL,'æ ¡é—¨å£','åŒ—äº¬äº¤é€šå¤§å­¦å®¶å±åŒºï¼ˆä¸œé—¨ï¼‰, Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0@ëâ6]@Môù(#úC@',NULL,NULL),(113,NULL,'å¥½åƒåŠ','äº¤å¤§ä¸œè·¯17å·, Haidian, Beijing','','\0\0\0\0\0\0\0Ø¶(³A]@ÙÎ÷SãùC@',NULL,NULL),(114,NULL,'å°šè†³å¤§é£Ÿå ‚','äº¤å¤§ä¸œè·¯ï¼ˆè¿‘ä½°é‡‘ktvï¼‰, Haidian, Beijing','','\0\0\0\0\0\0\0À*ŞÈ<]@¼®_°úC@',NULL,NULL),(115,NULL,'Axiang Rice Noodles','48 Xueyuan South Rd, Haidian','','\0\0\0\0\0\0\0P\0ş)U]@iÇ\r¿›úC@',NULL,NULL),(116,NULL,'èç‹åºœç¾Šèå­','25 Jiaotong Daxue Rd, Haidian','','\0\0\0\0\0\0\0(ˆº@]@äf¸ŸùC@',NULL,NULL),(117,NULL,'æ–°ç–†ç¾é£ŸåŸ','å­¦é™¢å—è·¯27å·, Haidian, Beijing','','\0\0\0\0\0\0\0ø•é)]@ş\n™+ƒúC@',NULL,NULL),(118,NULL,'é˜³å…‰ç¼˜æ—å’–å•¡äº¤å¤§åº—','Haidian, Beijing','','\0\0\0\0\0\0\0ø²í´5]@¡¾eN—ùC@',NULL,NULL),(119,NULL,'Tianfu Xiangguo','17 Jiaoda East Rd, Haidian','','\0\0\0\0\0\0\0p\ZÛkA]@½á´àùC@',NULL,NULL),(120,NULL,'å®œå“å°è‚¥ç¾Š','è¥¿ç›´é—¨å¤–äº¤å¤§ä¸œè·¯, Haidian, Beijing','','\0\0\0\0\0\0\0p4€·@]@VñFæùC@',NULL,NULL);
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
  `ts_valid` enum('true','false') NOT NULL DEFAULT 'true',
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

-- Dump completed on 2014-05-13 16:40:45
