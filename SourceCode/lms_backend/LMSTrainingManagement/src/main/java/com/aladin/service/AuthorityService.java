package com.aladin.service;

import com.aladin.domain.Authority;
import com.aladin.domain.Authority_;
import com.aladin.repository.AuthorityRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorityService {

    private AuthorityRepository authorityRepository;

    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    public List<Authority> getAllByLstNameIn(List<String> lstName){
        return authorityRepository.getAllByLstNameIn(lstName);
    }
}
