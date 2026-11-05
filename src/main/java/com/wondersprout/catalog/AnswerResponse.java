package com.wondersprout.catalog;

public record AnswerResponse(boolean correct, String correctAnswer, String lesson, String encouragement) {}
