package com.example.wbdvtravel_with_local.models;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;

public class POI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private List<String> weekdayHours;
    private List<String> travelers;//!!
    @ManyToOne()
    private Traveler thisTravelerPOI;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getWeekdayHours() {
        return weekdayHours;
    }

    public void setWeekdayHours(List<String> weekdayHours) {
        this.weekdayHours = weekdayHours;
    }

    public List<String> getTravelers() {
        return travelers;
    }

    public void setTravelers(List<String> travelers) {
        this.travelers = travelers;
    }

    //Return the traveler that save this POI
    public Traveler getThisTravelerPOI(){
        return thisTravelerPOI;
    }

    //Add this travel
    public void setThisTravelerPOI(){

    }


    public POI(){}

    public POI(Long id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
    }
}
