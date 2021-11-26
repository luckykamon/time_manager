-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 04 nov. 2021 à 13:36
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `api_time_manager`
--

-- --------------------------------------------------------

--
-- Structure de la table `clocks`
--

DROP TABLE IF EXISTS `clocks`;
CREATE TABLE IF NOT EXISTS `clocks` (
                                        `clockID` int(100) NOT NULL AUTO_INCREMENT,
                                        `userID` int(100) NOT NULL COMMENT 'username',
                                        `time` bigint(20) NOT NULL COMMENT 'timestamp',
                                        `status` tinyint(1) NOT NULL,
                                        PRIMARY KEY (`clockID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `teams`
--

DROP TABLE IF EXISTS `teams`;
CREATE TABLE IF NOT EXISTS `teams` (
                                       `teamID` int(11) NOT NULL AUTO_INCREMENT,
                                       `name` varchar(100) DEFAULT NULL,
                                       PRIMARY KEY (`teamID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `teams_connect`
--

DROP TABLE IF EXISTS `teams_connect`;
CREATE TABLE IF NOT EXISTS `teams_connect` (
                                               `teams_connectID` int(11) NOT NULL AUTO_INCREMENT,
                                               `teamID` int(11) NOT NULL,
                                               `userID` int(11) NOT NULL,
                                               PRIMARY KEY (`teams_connectID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
                                       `userID` int(11) NOT NULL AUTO_INCREMENT,
                                       `username` varchar(100) NOT NULL,
                                       `email` varchar(100) NOT NULL,
                                       `password` varchar(100) NOT NULL,
                                       `jwt_token` varchar(500) DEFAULT NULL,
                                       `role` enum('user','manager','general_manager','') NOT NULL DEFAULT 'user',
                                       PRIMARY KEY (`userID`),
                                       UNIQUE KEY `username` (`username`),
                                       UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userID`, `username`, `email`, `password`, `jwt_token`, `role`) VALUES
(1, 'admin', 'contact@lucasbodin.com', '$2b$10$AFmxDA2JBjf51Pnc6Cj/2.FnJ7dAhoc5O9jepUouPMKM/BZEkzISi', NULL, 'general_manager');

-- --------------------------------------------------------

--
-- Structure de la table `workingtimes`
--

DROP TABLE IF EXISTS `workingtimes`;
CREATE TABLE IF NOT EXISTS `workingtimes` (
                                              `workingtimeID` int(11) NOT NULL AUTO_INCREMENT,
                                              `userID` varchar(100) NOT NULL COMMENT 'username',
                                              `start` bigint(20) NOT NULL COMMENT 'timestamp',
                                              `end` bigint(20) NOT NULL COMMENT 'timestamp',
                                              PRIMARY KEY (`workingtimeID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
