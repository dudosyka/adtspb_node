CREATE TABLE `auth_assignment_min` (
  `id` int(11) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `rule` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `auth_assignment_min`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_role_rule_assignment` (`role`,`rule`) USING BTREE;

