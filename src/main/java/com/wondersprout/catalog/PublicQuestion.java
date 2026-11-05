package com.wondersprout.catalog;

import java.util.List;

public record PublicQuestion(String id, String prompt, String hint, List<String> choices, String answerValue, String lesson) {}
