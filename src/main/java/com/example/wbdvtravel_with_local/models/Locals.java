package com.example.wbdvtravel_with_local.models;

import javax.persistence.*;
public class Locals extends User{
    private String location;

    public Locals(String location) {
        this.location = location;
    }

    public Locals(String username, String password, String userType, String gender, String email, String selfie, Integer age, String location) {
        super(username, password, userType, gender, email, selfie, age);
        this.location = location;
    }
}
