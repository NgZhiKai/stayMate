package com.example.staymate.dto.bookmark;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BookmarkRequestDTO {
    private Long userId;
    private List<Long> hotelIds;

}
