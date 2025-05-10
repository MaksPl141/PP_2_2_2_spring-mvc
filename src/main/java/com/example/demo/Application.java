package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;


@SpringBootApplication
public class Application {

	public static void main(String[] args) {

		SpringApplication.run(Application.class, args);
		openBrowser();
	}
	private static void openBrowser() {
		String url = "http://localhost:8080";

		try {
			Runtime.getRuntime().exec("cmd /c start " + url);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}