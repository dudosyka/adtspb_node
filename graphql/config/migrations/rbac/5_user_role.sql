CREATE TABLE `user_role` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `auth_role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_role_id` (`auth_role_id`);

  
ALTER TABLE `user_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

  
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_ibfk_3` FOREIGN KEY (`auth_role_id`) REFERENCES `auth_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
