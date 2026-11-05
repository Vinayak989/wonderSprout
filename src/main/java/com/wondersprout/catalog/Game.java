package com.wondersprout.catalog;

import java.util.List;

public record Game(
        String id,
        String title,
        String subject,
        String mode,
        String description,
        String icon,
        String theme,
        int minutes,
        List<String> ageBands
) {}
