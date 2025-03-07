package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Scrap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface ScrapMapper {

    //scrap한 공고 insert
    void insertScrap(int userId, int jobPostId);

    //scrap 공고 삭제
    void deleteScrap(int userId, int jobPostId);

    //scrap 공고 조회
    List<Scrap> getScrapsByUser(int userId);

    //이미 스크랩 한 공고인지 확인
    boolean checkScrap(int userId, int jobPostId);


}


