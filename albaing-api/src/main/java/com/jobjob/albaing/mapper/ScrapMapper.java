package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Scrap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface ScrapMapper {

    //scrap한 공고 저장
    void insertScrap(int userId, int jobPostId);

    //scrap 공고 삭제
    void deleteScrap(int scrapId);

    //scrap 공고 조회(get)
    List<Scrap> getScrapsByUser(int userId);

}


