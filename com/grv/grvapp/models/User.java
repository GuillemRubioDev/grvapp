package com.grv.grvapp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

/**
 * Represents a user in the application.
 * Contains basic profile information and a profile image.
 */
@Entity
@Table(name = "users") // Specifies the database table name
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures auto-increment for the ID
    private Long id;

    private String firstName;
    private String lastName;

    /**
     * Stores the user's profile image as a byte array.
     * Marked as {@code @Lob} to indicate that it can be a large object.
     * The specific database column type (e.g., BLOB, BYTEA) will be determined by the JPA provider and database.
     */
    @Lob
    private byte[] profileImage;

    // Constructors

    /**
     * Default constructor for JPA.
     */
    public User() {
    }

    /**
     * Constructs a new User with specified first and last names.
     * @param firstName The user's first name.
     * @param lastName The user's last name.
     */
    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters

    /**
     * Gets the unique identifier of the user.
     * @return The user's ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the user.
     * Typically managed by JPA and should not be set manually after creation.
     * @param id The user's ID.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the user's first name.
     * @return The first name.
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the user's first name.
     * @param firstName The new first name.
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Gets the user's last name.
     * @return The last name.
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the user's last name.
     * @param lastName The new last name.
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Gets the user's profile image data.
     * @return A byte array representing the profile image, or null if not set.
     */
    public byte[] getProfileImage() {
        return profileImage;
    }

    /**
     * Sets the user's profile image data.
     * @param profileImage A byte array representing the profile image.
     */
    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }

    /**
     * Returns a string representation of the User object.
     * Excludes the {@code profileImage} field for brevity and to avoid large output.
     * @return A string containing the user's ID, first name, and last name.
     */
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                // Omitting profileImage from toString for brevity and security
                '}';
    }
}
