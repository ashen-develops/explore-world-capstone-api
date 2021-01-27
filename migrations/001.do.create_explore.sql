CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (225) NOT NULL
);

CREATE TABLE states (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    state VARCHAR (255) UNIQUE NOT NULL,
    city VARCHAR (255) UNIQUE NOT NULL,
    best_cheap_beer_spot VARCHAR (255) UNIQUE NOT NULL,
    bcbs_link VARCHAR (255) UNIQUE NOT NULL,
    best_dog_friendly_spot VARCHAR (255) UNIQUE NOT NULL,
    bdfs_link VARCHAR (255) UNIQUE NOT NULL,
    best_outdoorsy_spot VARCHAR (255) UNIQUE NOT NULL,
    bos_link VARCHAR (255) UNIQUE NOT NULL,
    best_local_fast_food_spot VARCHAR (255) UNIQUE NOT NULL,
    blffs_link VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE suggestions (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    for_place VARCHAR (255) UNIQUE NOT NULL,
    suggestion VARCHAR (255) UNIQUE NOT NULL
);

--  add user functionality to suggestions (not just anonymous)



