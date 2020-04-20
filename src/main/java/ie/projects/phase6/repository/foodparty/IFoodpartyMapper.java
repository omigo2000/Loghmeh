package ie.projects.phase6.repository.foodparty;

import ie.projects.phase6.repository.food.FoodDAO;
import ie.projects.phase6.repository.mapper.IMapper;
import ie.projects.phase6.repository.order.OrderDAO;

import java.sql.SQLException;
import java.util.ArrayList;

public interface IFoodpartyMapper extends IMapper<FoodDAO, Object[], String> {

    ArrayList<FoodDAO> getParty(String foodTableName) throws SQLException;
    void updateFoodCount(String restaurantId, ArrayList<OrderDAO> orders) throws SQLException;
}
