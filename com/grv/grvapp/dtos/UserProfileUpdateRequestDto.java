package com.grv.grvapp.dtos;

/**
 * Data Transfer Object for user profile update requests.
 * Contains fields that can be updated for a user's profile.
 */
public class UserProfileUpdateRequestDto {

    private String firstName;
    private String lastName;

    // Constructors

    /**
     * Default constructor.
     */
    public UserProfileUpdateRequestDto() {
    }

    /**
     * Constructs a new DTO with specified first and last names.
     * @param firstName The new first name.
     * @param lastName The new last name.
     */
    public UserProfileUpdateRequestDto(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters

    /**
     * Gets the new first name for the user.
     * @return The first name.
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the new first name for the user.
     * @param firstName The first name to set.
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Gets the new last name for the user.
     * @return The last name.
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the new last name for the user.
     * @param lastName The last name to set.
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
