CREATE TABLE project.ny_weather(
    STATION BIGINT,
    DATE DATETIME,
    HourlyDryBulbTemperature DECIMAL(6,2),
    HourlyPrecipitation DECIMAL(6,2),
    HourlyRelativeHumidity DECIMAL(6,2),
    HourlyStationPressure DECIMAL(6,2),
    HourlyWetBulbTemperature DECIMAL(6,2),
    HourlyWindGustSpeed DECIMAL(6,2),
    HourlyWindSpeed DECIMAL(6,2)
);

CREATE INDEX ny_weather_idx1 ON project.ny_weather (STATION, DATE);

CREATE TABLE project.ny_station(
    station VARCHAR(100),
    stationId BIGINT,
    zipcode VARCHAR(10),
    PRIMARY KEY ( stationId )
);

CREATE TABLE project.ny_load(
Time_Stamp datetime,
Capitl  DECIMAL(10,2),
Centrl  DECIMAL(10,2),
Dunwod  DECIMAL(10,2),
Genese  DECIMAL(10,2),
Hud_Vl  DECIMAL(10,2),
Longil  DECIMAL(10,2),
Mhk_Vl  DECIMAL(10,2),
Millwd  DECIMAL(10,2),
NYC     DECIMAL(10,2),
North   DECIMAL(10,2),
West    DECIMAL(10,2),
NYISO DECIMAL(10,2)
);


CREATE INDEX ny_load_idx1 ON project.ny_load (Time_Stamp);

create table project.ny_stats(
    zipcode VARCHAR(10),
    population BIGINT,
    county VARCHAR(100),
    zone VARCHAR(100),
    population_zone_pct DECIMAL(11,10),
    PRIMARY KEY ( zipcode )
);

ALTER TABLE project.weather ADD id INT AUTO_INCREMENT PRIMARY KEY;

create table IF NOT EXISTS  ny_combined
select 
	nyw.DATE,
	nys.zipcode, 
	nyss.zone,
    nyw.HourlyDryBulbTemperature,
    nyw.HourlyWetBulbTemperature,
    nyw.HourlyPrecipitation,
    nyw.HourlyRelativeHumidity,
    nyw.HourlyStationPressure,
    nyw.HourlyWindSpeed,
    nyw.HourlyWindGustSpeed,
    case
		when nyss.zone = 'N.Y.C.' then nyl.NYC
		when nyss.zone = 'Dunwod' then nyl.Dunwod
		when nyss.zone = 'Hud Vl' then nyl.Hud_Vl
		when nyss.zone = 'Longil' then nyl.Longil
		when nyss.zone = 'Capitl' then nyl.Capitl
		when nyss.zone = 'Mhk Vl' then nyl.Mhk_Vl
		when nyss.zone = 'North'  then nyl.North	
        when nyss.zone = 'Centrl' then nyl.Centrl
		when nyss.zone = 'Genese' then nyl.Genese
		when nyss.zone = 'west'   then nyl.West
	end zone_load_total,
        case
		when nyss.zone = 'N.Y.C.' then nyl.NYC      * nyss.population_zone_pct
		when nyss.zone = 'Dunwod' then nyl.Dunwod   * nyss.population_zone_pct
		when nyss.zone = 'Hud Vl' then nyl.Hud_Vl   * nyss.population_zone_pct
		when nyss.zone = 'Longil' then nyl.Longil   * nyss.population_zone_pct
		when nyss.zone = 'Capitl' then nyl.Capitl   * nyss.population_zone_pct
		when nyss.zone = 'Mhk Vl' then nyl.Mhk_Vl   * nyss.population_zone_pct
		when nyss.zone = 'North'  then nyl.North    * nyss.population_zone_pct	
        when nyss.zone = 'Centrl' then nyl.Centrl   * nyss.population_zone_pct
		when nyss.zone = 'Genese' then nyl.Genese   * nyss.population_zone_pct
		when nyss.zone = 'west'   then nyl.West     * nyss.population_zone_pct
	end zip_load_by_population
from project.ny_weather nyw
left join project.ny_station nys on nys.stationId = nyw.STATION
left join project.ny_stats nyss on nys.zipcode = nyss.zipcode
left join project.ny_load nyl on nyw.DATE = nyl.Time_Stamp;

CREATE INDEX ny_combined_idx1 ON project.ny_combined (DATE, zipcode);
