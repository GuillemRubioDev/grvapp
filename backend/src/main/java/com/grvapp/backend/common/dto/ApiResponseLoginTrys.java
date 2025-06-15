package com.grvapp.backend.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponseLoginTrys {
  private String message;
  private int remainingAttempts;
}
