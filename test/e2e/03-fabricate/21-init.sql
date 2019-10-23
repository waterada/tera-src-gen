-- aaaa
create table logs (
    id int(10) unsigned auto_increment not null comment 'ID',
    user_id int(10) unsigned not null comment 'ユーザID',
    category varchar(200) comment 'カテゴリー',
    big_num bigint(20) unsigned comment 'log_time',
    constraint logs_pk primary key (id)
);
