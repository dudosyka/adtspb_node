CREATE TABLE `auth_assignment` (
  `id` int(11) NOT NULL,
  `parent` int(11) NOT NULL,
  `child` int(11) NOT NULL,
  `type` int(1) NOT NULL COMMENT '1 - rule, 2 - role'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `auth_assignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_auth_assignment_auth_rule1_idx` (`parent`);

ALTER TABLE `auth_assignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

ALTER TABLE `auth_assignment`
  ADD CONSTRAINT `fk_auth_assignment_auth_rule1` FOREIGN KEY (`parent`) REFERENCES `auth_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
