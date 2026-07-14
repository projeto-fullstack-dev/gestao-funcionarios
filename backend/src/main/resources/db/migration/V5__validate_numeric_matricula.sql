DELIMITER $$

CREATE TRIGGER trg_vinculo_matricula_numeric_insert
BEFORE INSERT ON vinculo
FOR EACH ROW
BEGIN
    IF NEW.matricula IS NULL OR NEW.matricula NOT REGEXP '^[0-9]+$' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A matrícula deve conter apenas números';
    END IF;
END$$

CREATE TRIGGER trg_vinculo_matricula_numeric_update
BEFORE UPDATE ON vinculo
FOR EACH ROW
BEGIN
    IF NEW.matricula IS NULL OR NEW.matricula NOT REGEXP '^[0-9]+$' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A matrícula deve conter apenas números';
    END IF;
END$$

DELIMITER ;
