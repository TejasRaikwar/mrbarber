package com.mrbarber.controller;

import com.mrbarber.entity.Role;
import com.mrbarber.repository.AppointmentRepository;
import com.mrbarber.repository.EnquiryRepository;
import com.mrbarber.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AppointmentRepository appointmentRepo;
    private final EnquiryRepository enquiryRepo;
    private final UserAccountRepository userRepo;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        LocalDate today = LocalDate.now();

        LocalDate monthStart   = today.withDayOfMonth(1);
        int qStartMonth        = ((today.getMonthValue() - 1) / 3) * 3 + 1;
        LocalDate quarterStart = today.withMonth(qStartMonth).withDayOfMonth(1);
        LocalDate yearStart    = today.withDayOfYear(1);

        BigDecimal daily         = appointmentRepo.sumAmountBetween(today, today);
        BigDecimal monthly       = appointmentRepo.sumAmountBetween(monthStart, today);
        BigDecimal quarterly     = appointmentRepo.sumAmountBetween(quarterStart, today);
        BigDecimal annual        = appointmentRepo.sumAmountBetween(yearStart, today);
        BigDecimal employeeSpend = userRepo.sumSalaryByRole(Role.STAFF);

        Map<String, Object> body = new HashMap<>();
        body.put("dailyIncome",       daily);
        body.put("monthlyIncome",     monthly);
        body.put("quarterlyIncome",   quarterly);
        body.put("annualIncome",      annual);
        body.put("totalAppointments", appointmentRepo.count());
        body.put("totalEnquiries",    enquiryRepo.count());
        body.put("totalStaff",        userRepo.findAllByRole(Role.STAFF).size());
        body.put("employeeSpending",  employeeSpend);
        return body;
    }
}
