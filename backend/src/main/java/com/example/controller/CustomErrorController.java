package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // Return the custom error page
        return "error";  // This corresponds to the error.html view
    }
}
