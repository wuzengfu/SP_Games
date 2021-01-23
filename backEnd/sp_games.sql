CREATE DATABASE  IF NOT EXISTS `sp_games` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_games`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_games
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `catid` int NOT NULL AUTO_INCREMENT,
  `catname` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`catid`),
  UNIQUE KEY `catname_UNIQUE` (`catname`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Action','An action game emphasizes physical challenges, including hand–eye coordination and reaction-time','2020-11-29 10:52:03'),(6,'Combat','Combat games allow you to take part in a range of different types of fighting and prove your skills as a warrior or general.','2020-11-29 11:02:15'),(7,'Adventure','A type of video game in which the participant plays a fantasy role in an episodic adventure story.','2020-11-29 11:04:15'),(9,'FPS','A game which needs a high-refresh-rate screen ussually shooting game.','2020-11-29 14:42:53'),(10,'Violence','A type of game that is usually related to killing,bleeding etc...','2020-12-14 06:10:06'),(12,'Crime','A game that allows players to choose multiple roles they want to be in the game in order to engage them.','2020-12-20 07:39:46'),(15,'Modern','A game that is designed based on the modern world!','2020-12-30 04:23:52');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `gameid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `platform` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gameid`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,'Assassin’s Creed Valhalla','Assassin\'s Creed Valhalla is an action role-playing video game developed by Ubisoft Montreal and published by Ubisoft',69.9,'PC',2020,'2020-11-29 12:21:33',''),(11,'CSGO','The Global Offensive professional scene consists of tournaments hosted by third-party organisations and Valve-organised or co-sponsored tournaments, referred to as Majors.',16,'PC',2002,'2020-11-30 13:25:38',''),(12,'GTA5','A game that allows players to complete missions to earn money so that they can do more things such as buying a car...',55,'PC',2015,'2020-12-14 06:19:53','E:\\Information Technology\\BED\\CA1\\valid_image.jpg'),(14,'Minecraft','A creative game that allows players to build anything that want.',50,'Mobile',2020,'2020-12-20 07:56:49','');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_categories`
--

DROP TABLE IF EXISTS `game_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gameid` int NOT NULL,
  `catid` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `catid_idx` (`catid`),
  KEY `gameid_idx` (`gameid`),
  CONSTRAINT `catid` FOREIGN KEY (`catid`) REFERENCES `category` (`catid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gameid` FOREIGN KEY (`gameid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_categories`
--

LOCK TABLES `game_categories` WRITE;
/*!40000 ALTER TABLE `game_categories` DISABLE KEYS */;
INSERT INTO `game_categories` VALUES (1,1,1,'2020-11-29 13:09:17'),(15,11,7,'2020-11-30 13:27:21'),(17,11,9,'2020-11-30 13:27:34'),(18,1,6,'2020-12-03 06:03:05'),(19,12,1,'2020-12-14 06:19:53'),(21,12,7,'2020-12-14 06:19:53'),(25,14,1,'2020-12-20 07:56:49'),(26,14,9,'2020-12-20 07:56:49');
/*!40000 ALTER TABLE `game_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `posterid` int NOT NULL,
  `gameid` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `rating` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  KEY `posterid_idx` (`posterid`),
  KEY `game_id_idx` (`gameid`),
  CONSTRAINT `game_id` FOREIGN KEY (`gameid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `posterid` FOREIGN KEY (`posterid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,'Enjoyed the game! The story and gameplay was good!',5,'2020-11-30 12:51:08'),(5,2,11,'Very good to play with friends!',4,'2020-11-30 13:29:29'),(6,2,1,'Cannot wait for the next version to be released!',5,'2020-11-30 13:30:09'),(7,5,11,'The server sometimes collapses!',3.5,'2020-11-30 13:32:45'),(8,16,12,'I can buy whatever I want in this game!',4,'2020-12-14 07:05:41'),(12,16,14,'Creative game, u can build whatever you want in this game',5,'2020-12-20 15:06:49');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `profile_pic_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `profile_pic_url_UNIQUE` (`profile_pic_url`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Terry Tan','terry@gmail.com','Customer','https://www.abc.com/terry.jpg','2020-11-29 09:54:34'),(2,'George','george@gmail.com','Admin','https://www.abc.com/george.jpg','2020-11-29 10:18:30'),(3,'John','john@gmail.com','Customer','https://www.abc.com/john.jpg','2020-11-29 10:21:27'),(4,'Chole','chole@gmail.com','Customer','https://www.abc.com/chole.jpg','2020-11-29 10:23:02'),(5,'Wu Zengfu','zengfu@gmail.com','Admin','https://www.abc.com/zengfu.jpg','2020-11-29 10:24:09'),(12,'Yang Xuan','xuan@gmail.com','Customer','https://www.abc.com/xuan.jpg','2020-11-29 10:31:14'),(13,'Jerry','jerry@gmail.com','Customer','https://www.abc.com/jerry.jpg','2020-11-29 14:39:02'),(16,'Jeniffer','jeniffer@gmail.com','sfsf','https://www.abc.com/jeniffer.jpg','2020-12-14 06:05:37'),(23,'bob','bob@gmail.com','Customer','https://www.abc.com/bob.jpg','2020-12-20 07:32:34'),(25,'Tom','tom@gmail.com','Example','https://www.abc.com/tom.png','2020-12-30 04:22:16');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-03 17:02:27
