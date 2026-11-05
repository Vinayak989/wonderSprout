package com.wondersprout.catalog;

import java.util.List;

record Question(
        String id,
        String prompt,
        String hint,
        List<String> choices,
        String answer,
        String lesson
) {}
