package ie.projects.phase1.core;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import ie.projects.phase1.exceptions.CartValidationException;
import ie.projects.phase1.server.jsonCreator.JSONStringCreator;

import java.lang.reflect.Type;
import java.util.HashMap;

public class Cart {
    private Integer id = 1;
    private HashMap<String, Integer> orders = new HashMap<String, Integer>();
    private HashMap<String, Integer> partyOrders = new HashMap<String, Integer>();
    private String restaurantId;
    private String deliveryManId;
    private String orderStatus;
    private long deliveryManFoundedTime;
    private double deliveryManTimeToReach;
    private double remainingTimeToDeliver;

    public Cart(){}

    public Cart(Integer id, HashMap<String, Integer> orders, HashMap<String, Integer> partyOrders, String restaurantId, String deliveryManId, String orderStatus, long deliveryManFoundedTime, double deliveryManTimeToReach){
        this.id = id;
        Gson gson = new Gson();
        String ordersJsonString = gson.toJson(orders);
        String partyOrdersJsonString = gson.toJson(partyOrders);
        Type type = new TypeToken<HashMap<String, Integer> >(){}.getType();
        this.orders = gson.fromJson(ordersJsonString, type);
        this.partyOrders = gson.fromJson(partyOrdersJsonString, type);
        this.restaurantId = restaurantId;
        this.deliveryManId = deliveryManId;
        this.orderStatus = orderStatus;
        this.deliveryManFoundedTime = deliveryManFoundedTime;
        this.deliveryManTimeToReach = deliveryManTimeToReach;
        this.remainingTimeToDeliver = 0;
    }

    public HashMap<String, Integer> getOrders() {
        return orders;
    }

    public HashMap<String, Integer> getPartyOrders() { return partyOrders; }

    public int getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }

    public String getDeliveryManId() { return deliveryManId; }
    public void setDeliveryManId(String deliveryManId) { this.deliveryManId = deliveryManId; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public long getDeliveryManFoundedTime() { return deliveryManFoundedTime; }
    public void setDeliveryManFoundedTime(long deliveryManFoundedTime) { this.deliveryManFoundedTime = deliveryManFoundedTime; }

    public double getDeliveryManTimeToReach() { return deliveryManTimeToReach; }
    public void setDeliveryManTimeToReach(double deliveryManTimeToReach) { this.deliveryManTimeToReach = deliveryManTimeToReach; }

    public double getRemainingTimeToDeliver() { return remainingTimeToDeliver; }

    public void setRemainingTimeToDeliver(double remainingTimeToDeliver) { this.remainingTimeToDeliver = remainingTimeToDeliver; }

    private void addToCartUtil(HashMap<String, Integer> newOrder, String foodName, int number, boolean isNew) throws CartValidationException{
        if (newOrder.containsKey(foodName)) {
            int foodNum = newOrder.get(foodName);
            if (foodNum + number == 0)
                newOrder.remove(foodName);
            else if(foodNum + number < 0)
                throw new CartValidationException(new JSONStringCreator().msgCreator("تعداد درخواستی برای حذف، بیشتر از تعداد انتخاب شده می‌باشد."));
            else
                newOrder.put(foodName, foodNum + number);
        }
        else {
            if(isNew == false)
                throw new CartValidationException(new JSONStringCreator().msgCreator("غذای درخواست‌شده برای تغییر، موجود نمی‌باشد."));
            else {
                if(number <= 0)
                    throw new CartValidationException(new JSONStringCreator().msgCreator("لطفا عدد مثبتی را وارد نمایید."));
                newOrder.put(foodName, number);
            }
        }
    }

    public void addToCart(String foodName, int number, String restaurantId, boolean isParty, boolean isNew) throws CartValidationException{
        if(number == 0)
            throw new CartValidationException(new JSONStringCreator().msgCreator("لطفا عدد دیگری غیر از ۰ وارد کنید."));
        if(isParty) {
            this.addToCartUtil(this.partyOrders, foodName, number, isNew);
        }
        else {
            this.addToCartUtil(this.orders, foodName, number, isNew);
        }
        this.restaurantId = restaurantId;
        if((this.orders.size() == 0) && (this.partyOrders.size() == 0))
            this.clearOrders();
    }

    public void clearOrders(){
        restaurantId = null;
        deliveryManId = null;
        orderStatus = null;
        orders.clear();
        partyOrders.clear();
    }
}
