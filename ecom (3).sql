-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2025 at 06:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecom`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `path` varchar(255) NOT NULL,
  `letter` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `jobId`, `userId`, `status`, `applied_at`, `path`, `letter`) VALUES
(11, 41, 7, 'open', '2025-03-17 00:31:32', '/uploads/1742171492867.pdf', 'sffffffffffffffff fdssssssss               fsdfsf sfs'),
(12, 41, 7, 'open', '2025-03-17 00:34:34', '/uploads/1742171674819.pdf', 'sffffffffffffffff fdssssssss               fsdfsf sfs');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `statue` varchar(20) DEFAULT 'not approved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `logo`, `location`, `industry`, `website`, `created_at`, `userId`, `statue`) VALUES
(8, 'chouaib', '/uploads/logo-1746631866831.png', 'algeria', 'tech', 'https://chatgpt.com/c/6814c4f2-9f9c-800d-8393-2fd3ed36db7d', '2025-05-07 15:31:06', 6, 'not approved');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `salary` varchar(255) NOT NULL,
  `status` varchar(30) NOT NULL,
  `employerId` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `description`, `salary`, `status`, `employerId`, `type`, `companyId`) VALUES
(41, 'hbb', 'ddddddddd', 'ddddddddd', 'open', 5, NULL, NULL),
(44, 'frontend intren', 'ggggggggggg', 'unpaid', 'open', 6, 'Internship', NULL),
(46, 'backend', 'fffffffffffffff', 'unpaid', 'open', 6, 'Internship', NULL),
(48, 'kkkkkkkkk', 'kkkkkk', '200000', 'open', 6, 'Full Time', NULL),
(49, 'ffffffffff', 'ffffffffffff', 'ffffffff', 'open', 6, 'Full Time', 8);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `familyname` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'NULL',
  `email` varchar(30) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `familyname`, `role`, `email`, `password`, `user_img`) VALUES
(5, 'chouaib', 'fff', 'employer', 'anis.ouchene.3434@gmail.com', '$2b$10$vhbjUE4YVwDzyAst49RANelGzJ/oeeQiyvylGFCyWQ4Fme6zsPFOW', NULL),
(6, 'amin', 'noufel', 'employer', 'chou@gmail.com', '$2b$10$Il2vLcxY6KnYNRb5tvUcqOcujEICm1SAD9EvdtWsKHRPe5q2M9l2G', NULL),
(7, 'chouaib', '2026done', 'jobseeker', 'chouaibe2019@gmail.com', '$2b$10$KEzECNOfRZElWRHIPUANCOam2EE8ULLpYmYsf82y1uA4vOVickGte', NULL),
(8, 'ffffffff', 'fffffffffff', 'jobseeker', 'choukibebba@gmail.com', '$2b$10$0UiD2TRU3NpUArHfdZDRrujGSM5jtuGVZEcoNkRaS5GWYlEwQ3eLO', NULL),
(9, 'admin', 'admin', 'admin', 'admin@gmail.com', '$2b$10$yZ0N0fcVKh3GiBzKGKV4V.4MmazS5TwjnIXgnXDfQeMQ1SyJEpkgy', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobId` (`jobId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`userId`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employerId` (`employerId`),
  ADD KEY `fk_company` (`companyId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_applications_job` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_applications_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `fk_jobs_employer` FOREIGN KEY (`employerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
