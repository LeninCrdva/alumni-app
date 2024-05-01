package ec.edu.ista.springgc1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Springgc1Application {

	public static void main(String[] args) {
		SpringApplication.run(Springgc1Application.class, args);
		System.out.println("Inicio exitoso");
	}

}
