package web.dao;

import org.springframework.stereotype.Repository;
import web.model.Car;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class CarDaoImpl implements CarDao {

    private final List<Car> carList;

    public CarDaoImpl(List<Car> carList) {
        this.carList = carList != null ? carList : new ArrayList<>();
    }

    @Override
    public List<Car> getCars(int count) {
        if (count <= 0 || count >= carList.size()) {
            return new ArrayList<>(carList);
        }
        return carList.stream().limit(count).collect(Collectors.toList());
    }
}