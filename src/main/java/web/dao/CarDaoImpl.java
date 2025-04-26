package web.dao;

import org.springframework.stereotype.Repository;
import web.model.Car;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class CarDaoImpl implements CarDao {
    private static final List<Car> carList = new ArrayList<>();

    static {
     carList.add(new Car("Toyota Rav4", "White", 2021, 2200000));
        carList.add(new Car("BMW X6", "Black", 2016,4000000));
        carList.add(new Car("Kia Sorento", "Gray", 2024,3000000));
        carList.add(new Car("Audi A8", "Yellow", 2020,5000000));
        carList.add(new Car("Porsche Cayenne", "blue", 2012,1900000));
}
    @Override
    public List<Car> getCars(int count) {
        if (count <= 0 || count >= carList.size()) {
            return new ArrayList<>(carList); // Возвращаем копию списка
        }
        return carList.stream().limit(count).collect(Collectors.toList());
    }
}