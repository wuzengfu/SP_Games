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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,'Assassin’s Creed','Assassin\'s Creed Valhalla is an action role-playing video game developed by Ubisoft Montreal and published by Ubisoft',69.9,'PC',2020,'2020-11-29 12:21:33','assassins.jpg'),(12,'GTA5','A game that allows players to complete missions to earn money so that they can do more things such as buying a car...',55,'PC',2015,'2020-12-14 06:19:53','gta5.jpg'),(14,'Minecraft','A creative game that allows players to build anything that want.',50,'Mobile',2020,'2020-12-20 07:56:49','minecraft.jpg'),(55,'Hackman','Hackman',123,'PC',2020,'2021-01-07 05:51:21','hackman.jpg'),(56,'LOL','A game that is very popular throughout the world for years',30,'PC',2008,'2021-01-23 04:53:01','lol.jpg'),(57,'Glory of Kings','A mobile game developed by Tencent, it is a very similar game to PC\'s LOL',179,'Mobile',2016,'2021-01-23 04:54:50','glory.jpg'),(58,'PUBG','A shooting game that requires players to survive until the end',139,'Mobile',2018,'2021-01-23 04:56:03','pubg.jpg'),(59,'Plants VS Zombies','A very old game that is very popular during 2010',39,'Mobile',2008,'2021-01-23 04:57:11','plants.jpg'),(60,'Curse IsLand','A game that allows you to use your skills to survive in this Island!',89,'PC',2012,'2021-01-28 17:12:20',NULL),(61,'Human: Fall Flat','A game that allows you to play with as many people as possible. The more people, the more fun it will be!',25,'PC',2017,'2021-01-28 17:23:54',NULL),(72,'Hu','sss',89,'PC',2012,'2021-02-02 03:55:00',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_categories`
--

LOCK TABLES `game_categories` WRITE;
/*!40000 ALTER TABLE `game_categories` DISABLE KEYS */;
INSERT INTO `game_categories` VALUES (1,1,1,'2020-11-29 13:09:17'),(18,1,6,'2020-12-03 06:03:05'),(19,12,1,'2020-12-14 06:19:53'),(21,12,7,'2020-12-14 06:19:53'),(25,14,1,'2020-12-20 07:56:49'),(26,14,9,'2020-12-20 07:56:49'),(79,55,12,'2021-01-07 05:51:21'),(80,55,7,'2021-01-07 05:51:21'),(81,60,7,'2021-01-28 17:12:20'),(82,61,1,'2021-01-28 17:23:54'),(93,72,7,'2021-02-02 03:55:00'),(94,72,6,'2021-02-02 03:55:00'),(95,72,12,'2021-02-02 03:55:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,'Enjoyed the game! The story and gameplay was good!',5,'2020-11-30 12:51:08'),(6,2,1,'Cannot wait for the next version to be released!',5,'2020-11-30 13:30:09'),(8,16,12,'I can buy whatever I want in this game!',4,'2020-12-14 07:05:41'),(12,16,14,'Creative game, u can build whatever you want in this game',5,'2020-12-20 15:06:49'),(18,26,55,'fine',7,'2021-01-07 05:57:25'),(23,4,12,'This is such a good game!',5,'2021-01-27 17:10:51'),(24,1,1,'Nice game to play!',4,'2021-01-27 17:22:53'),(29,1,59,'Very good game!',5,'2021-01-28 14:20:04'),(30,1,58,'This is a good shooting game to play with friends!',4,'2021-01-28 15:06:40'),(31,1,60,'The game should do more regarding visual effects',3,'2021-01-28 17:44:48'),(38,1,12,'sfff',3,'2021-02-02 03:08:25'),(39,1,12,'sss',0,'2021-02-02 03:09:33');
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
  `password` varchar(45) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `profile_pic_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `profile_pic_url_UNIQUE` (`profile_pic_url`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Terry Tan','terry@gmail.com','terrypw','Customer','https://www.abc.com/terry.jpg','2020-11-29 09:54:34'),(2,'George','george@gmail.com','georgepw','Admin','https://www.abc.com/george.jpg','2020-11-29 10:18:30'),(3,'John','john@gmail.com','johnpw','Customer','https://www.abc.com/john.jpg','2020-11-29 10:21:27'),(4,'Chole','chole@gmail.com','cholepw','Customer','https://www.abc.com/chole.jpg','2020-11-29 10:23:02'),(5,'Wu Zengfu','zengfu@gmail.com','zfpw','Admin','https://www.abc.com/zengfu.jpg','2020-11-29 10:24:09'),(12,'Yang Xuan','xuan@gmail.com','yxpw','Customer','https://www.abc.com/xuan.jpg','2020-11-29 10:31:14'),(13,'Jerry','jerry@gmail.com','jerrypw','Customer','https://www.abc.com/jerry.jpg','2020-11-29 14:39:02'),(16,'Jeniffer','jeniffer@gmail.com','jenifferpw','sfsf','https://www.abc.com/jeniffer.jpg','2020-12-14 06:05:37'),(23,'bob','bob@gmail.com','bobpw','Customer','https://www.abc.com/bob.jpg','2020-12-20 07:32:34'),(25,'Tom','tom@gmail.com','tompw','Example','https://www.abc.com/tom.png','2020-12-30 04:22:16'),(26,'Jhon','example1@gmail.com','Jhonpw','Customer','https://www.abc.com/example1.jpg','2021-01-07 05:47:31'),(27,'Ann Ang','annang@gmail.com','annpw','Admin','annang.jpg','2021-02-02 02:22:39'),(28,'Tom Tam','tomtam@gmail.com','tompw','Customer','tomtam.jpg','2021-02-02 02:22:39');
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

-- Dump completed on 2021-02-03  0:01:35
