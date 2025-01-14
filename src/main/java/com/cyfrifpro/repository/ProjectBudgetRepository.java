package com.cyfrifpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cyfrifpro.model.ProjectBudget;

@Repository
public interface ProjectBudgetRepository extends JpaRepository<ProjectBudget, Long> {
	List<ProjectBudget> findByProjectId(Long projectId);
}