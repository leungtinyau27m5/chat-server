-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: chat_app
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `type` enum('private','group') NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(2048) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,'01','group',NULL,NULL,'2022-04-20 02:59:19','2022-04-20 02:59:19');
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_chat` BEFORE UPDATE ON `chats` FOR EACH ROW begin
if not exists (
	select * from participants p
    where p.role in ('owner', 'admin')
    and p.chat_id = new.id
)
then
	signal sqlstate '45000'
    set message_text = 'unauthroized user';
end if;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `owner_id` int NOT NULL,
  `user_id` int NOT NULL,
  `marked_name` varchar(20) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`owner_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `chat_id` int NOT NULL,
  `message` text,
  `media` varchar(2048) DEFAULT NULL COMMENT 'url',
  `meta` json DEFAULT NULL COMMENT 'desc, type, reply',
  `deleted` tinyint NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,11,1,'hello??',NULL,'null',0,'2022-04-21 07:11:32','2022-04-21 07:11:32'),(2,11,1,'omg??2',NULL,'null',0,'2022-04-21 07:30:50','2022-04-21 07:30:50'),(3,11,1,'omg??3',NULL,'null',0,'2022-04-21 07:32:56','2022-04-21 07:32:56'),(4,11,1,'omg??4',NULL,'null',0,'2022-04-21 07:33:23','2022-04-21 07:33:23'),(5,11,1,'hello??',NULL,'null',0,'2022-04-21 07:34:18','2022-04-21 07:34:18'),(6,11,1,'done??',NULL,'null',0,'2022-04-21 07:34:39','2022-04-21 07:34:39'),(7,11,1,'it is done! YS',NULL,'null',0,'2022-04-21 07:36:45','2022-04-21 07:36:45'),(8,11,1,'great',NULL,'null',0,'2022-04-21 07:39:44','2022-04-21 07:39:44'),(9,11,1,'testing',NULL,'null',0,'2022-04-21 07:40:06','2022-04-21 07:40:06'),(10,11,1,'get id',NULL,'null',0,'2022-04-21 07:40:48','2022-04-21 07:40:48'),(11,11,1,'great',NULL,'null',0,'2022-04-21 07:42:02','2022-04-21 07:42:02'),(12,11,1,'get',NULL,'null',0,'2022-04-21 07:43:00','2022-04-21 07:43:00'),(13,11,1,'get',NULL,'null',0,'2022-04-21 07:43:07','2022-04-21 07:43:07'),(14,11,1,'swap',NULL,'null',0,'2022-04-21 07:44:08','2022-04-21 07:44:08'),(15,11,1,'send and update',NULL,'null',0,'2022-04-21 07:45:20','2022-04-21 07:45:20'),(16,11,1,'hero',NULL,'null',0,'2022-04-21 07:47:00','2022-04-21 07:47:00'),(17,11,1,'hihi',NULL,'null',0,'2022-04-21 11:35:58','2022-04-21 11:35:58'),(18,11,1,'hihi',NULL,'null',0,'2022-04-21 11:43:52','2022-04-21 11:43:52'),(19,11,1,'hihi',NULL,'null',0,'2022-04-21 11:47:11','2022-04-21 11:47:11'),(20,11,1,'byebye',NULL,'null',0,'2022-04-21 11:47:21','2022-04-21 11:47:21'),(21,11,1,'message handling',NULL,'null',0,'2022-04-21 11:50:53','2022-04-21 11:50:53'),(22,11,1,'message handling..',NULL,'null',0,'2022-04-21 11:51:01','2022-04-21 11:51:01'),(23,11,1,'1',NULL,'null',0,'2022-04-21 11:51:34','2022-04-21 11:51:34'),(24,11,1,'2',NULL,'null',0,'2022-04-21 11:51:38','2022-04-21 11:51:38'),(25,11,1,'hello',NULL,'null',0,'2022-04-21 11:52:13','2022-04-21 11:52:13'),(26,11,1,'what??',NULL,'null',0,'2022-04-21 11:52:34','2022-04-21 11:52:34'),(27,11,1,'1',NULL,'null',0,'2022-04-21 11:53:46','2022-04-21 11:53:46'),(28,11,1,'2',NULL,'null',0,'2022-04-21 11:53:51','2022-04-21 11:53:51'),(29,11,1,'de',NULL,'null',0,'2022-04-21 11:54:14','2022-04-21 11:54:14'),(30,11,1,'decs',NULL,'null',0,'2022-04-21 11:54:15','2022-04-21 11:54:15'),(31,11,1,'qwef',NULL,'null',0,'2022-04-21 11:54:28','2022-04-21 11:54:28'),(32,11,1,'qwef.0.0',NULL,'null',0,'2022-04-21 11:54:37','2022-04-21 11:54:37'),(33,11,1,'0.0',NULL,'null',0,'2022-04-21 11:55:25','2022-04-21 11:55:25'),(34,11,1,'T_T',NULL,'null',0,'2022-04-21 12:13:19','2022-04-21 12:13:19'),(35,11,1,'T_T',NULL,'null',0,'2022-04-21 12:14:54','2022-04-21 12:14:54'),(36,11,1,'long etaslkfjlksajfklsjadfkljsadklfjklsdjafkljsdklfjklasdjflsjadklfjklsadfjaijeiofjwoqijfiojiodsfnnjncjiuihuiwefnjkdsncuihuishdcnjkwencjksndjkhcuihjdmjidcuihwkeihfiuahoisahfodjkmfnqkjwencjknwekjcnjkqwenjeckniwuehcoiuwhqeocihwoeihcohwqoiehciowqheiochoiqwehco',NULL,'null',0,'2022-04-21 12:15:58','2022-04-21 12:15:58'),(37,11,1,'long long longlon gasdijfoiasjfioajseiofjioasdjfiojsdiofjoiasjfiojasdjsklfnkmasdnckjhuiowqenfkjndcjihiasndjkcnuijewjkfniohcjkndxckhjijweqnciohxcjknqowisehcijnsdlkcjaksjhdciushfkjqbwenkchiusdjhckjasndciowqehcijnsdkmacbkjasdgfuiqwehckjnsdjkcnjksaednfiowqe',NULL,'null',0,'2022-04-21 12:19:01','2022-04-21 12:19:01'),(38,11,1,'testing overflow',NULL,'null',0,'2022-04-21 12:40:07','2022-04-21 12:40:07');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_insert_message_valid_user` BEFORE INSERT ON `messages` FOR EACH ROW begin
if NOT EXISTS (
	select p.chat_id, p.role, users.id from users
    inner join participants p
    on p.user_id = users.id
    where p.role IN ('admin', 'owner', 'member')
    and p.chat_id = NEW.chat_id
    and users.id = NEW.sender_id
)
then 
	signal sqlstate '45000'
    SET MESSAGE_TEXT = 'unauthroized user';
end if;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `chat_id` int NOT NULL,
  `user_id` int NOT NULL,
  `last_seen` timestamp NULL DEFAULT NULL,
  `role` enum('owner','admin','member','listener') NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`chat_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES (1,11,NULL,'owner','2022-04-20 03:04:55','2022-04-20 03:04:55');
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `status` enum('available','busy','leave','hide','offline') NOT NULL,
  `profile_pic` varchar(2048) DEFAULT NULL COMMENT 'url',
  `bio` varchar(255) DEFAULT NULL COMMENT 'self description',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'Steve01','steve01@gmail.com','$2b$10$.KJAf8n/CUP/DF1pWeycEu.M5vkbBYkVsQ7Fp.m5Cb6HWmm8adCz6','offline','1e5ba710-dd66-4aba-94b8-44c6a6165b25',NULL,'2022-04-19 12:26:33','2022-04-19 12:26:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'chat_app'
--

--
-- Dumping routines for database 'chat_app'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-21 20:56:30
