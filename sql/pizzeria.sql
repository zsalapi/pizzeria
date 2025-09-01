-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2025. Júl 16. 17:45
-- Kiszolgáló verziója: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- PHP verzió: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `pizzeria`
--
CREATE DATABASE IF NOT EXISTS `pizzeria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pizzeria`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Pizza'),
(2, 'Ital'),
(9, 'Desszert');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ordered_products`
--

CREATE TABLE `ordered_products` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `count` int(11) NOT NULL CHECK (`count` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ordered_products`
--

INSERT INTO `ordered_products` (`id`, `order_id`, `product_id`, `count`) VALUES
(5, 2, 3, 1),
(7, 2, 6, 2),
(13, 4, 2, 1),
(15, 4, 7, 2),
(19, 6, 1, 1),
(20, 6, 5, 4),
(21, 7, 1, 2),
(22, 7, 5, 1),
(23, 8, 1, 1),
(24, 8, 5, 1),
(25, 9, 3, 1),
(26, 9, 7, 2),
(27, 9, 14, 1),
(41, 19, 1, 1),
(42, 19, 7, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `status` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `orders`
--

INSERT INTO `orders` (`id`, `name`, `phone`, `address`, `status`, `created_at`) VALUES
(2, 'Teszt Elek', '0670555777', '1188 Bp. Kossuth Lajos u. 30', 'Teljesítve', '2025-07-16 11:35:41'),
(4, 'Teszt Elek', '0630444333', '1188 Bp. Kossith Lajos u. 30', 'Folyamatban', '2025-07-16 11:41:06'),
(6, 'Sándor', '0630444111', '1188 Bp. Kossuth L. 10', 'Folyamatban', '2025-07-16 13:56:59'),
(7, 'Zsolt', '0630111222', '1188 Bp. Petőfi S. u. 32', 'Folyamatban', '2025-07-16 16:29:23'),
(8, 'Nagy Dénes', '0630111222', '1183 Bp. Nemes u. 10.', 'Folyamatban', '2025-07-16 17:26:33'),
(9, 'Király Gábor', '06304441111', '1123 Bp. Károly u. 12.', 'Teljesítve', '2025-07-16 17:31:44'),
(19, 'Károly Róbert', '0670243222111', '1183 Bp. Nemes u. 123.', 'Folyamatban', '2025-07-16 19:15:59');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `picture`) VALUES
(1, 1, 'Margherita', 1990, '68779e9dafb07.png'),
(2, 1, 'Pepperoni', 2290, '6877b1340bd84.png'),
(3, 1, 'Hawaii', 2190, '6877b13cb6c28.png'),
(5, 2, 'Coca-Cola 0.5L', 490, '6877b146243d8.png'),
(6, 2, 'Fanta 0.5L', 490, '6877b150af908.jpg'),
(7, 2, 'Ásványvíz 0.5L', 390, '6877b15ace1e4.png'),
(14, 9, 'Tiramisu', 1000, '6877e50fa2fd2.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer','staff') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `role`) VALUES
(2, 'admin', '8a2491a360e5060e141255a33bf25b24e625e123d67d6a086dcbd7fd07ff913c', 'admin'),
(4, 'admin2', '8a2491a360e5060e141255a33bf25b24e625e123d67d6a086dcbd7fd07ff913c', 'admin');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `ordered_products`
--
ALTER TABLE `ordered_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `ordered_products`
--
ALTER TABLE `ordered_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ordered_products`
--
ALTER TABLE `ordered_products`
  ADD CONSTRAINT `ordered_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ordered_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
