package jb.studio.ground.grocerymarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GroceryMarketApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroceryMarketApplication.class, args);
    }

}
