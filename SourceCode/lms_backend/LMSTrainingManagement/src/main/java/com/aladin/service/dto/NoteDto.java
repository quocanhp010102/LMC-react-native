package com.aladin.service.dto;

import java.time.LocalDate;
import java.util.Date;

public class NoteDto {
    private Long id;
    private Date noteDate;
    private String noteTitle;
    private String noteContent;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NoteDto(Long id, Date noteDate, String noteTitle, String noteContent) {
        this.id = id;
        this.noteDate = noteDate;
        this.noteTitle = noteTitle;
        this.noteContent = noteContent;
    }

    public NoteDto() {
    }

    public Date getNoteDate() {
        return noteDate;
    }

    public void setNoteDate(Date noteDate) {
        this.noteDate = noteDate;
    }

    public String getNoteTitle() {
        return noteTitle;
    }

    public void setNoteTitle(String noteTitle) {
        this.noteTitle = noteTitle;
    }

    public String getNoteContent() {
        return noteContent;
    }

    public void setNoteContent(String noteContent) {
        this.noteContent = noteContent;
    }
}
