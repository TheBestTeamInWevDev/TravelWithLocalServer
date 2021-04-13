package com.example.wbdvtravel_with_local.models;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.List;

public class Traveler extends User{
    //One To many for job interests
    @OneToMany(mappedBy="thisStudentJobInterests", orphanRemoval = true, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SELECT)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<POI> POIsForThisTraveler;

    public Traveler(){
        super();
    }
    public Traveler(String username, String password, String userType, String gender, String email, String selfie, Integer age) {
        super(username, password, userType, gender, email, selfie, age);
    }
}
