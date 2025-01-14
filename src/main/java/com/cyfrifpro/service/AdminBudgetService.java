package com.cyfrifpro.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyfrifpro.model.Manager;
import com.cyfrifpro.model.ManagerBudget;
import com.cyfrifpro.model.Project;
import com.cyfrifpro.model.ProjectBudget;
import com.cyfrifpro.repository.ManagerBudgetRepository;
import com.cyfrifpro.repository.ProjectBudgetRepository;
import com.cyfrifpro.repository.ProjectRepository;

@Service
public class AdminBudgetService {

	@Autowired
	private ManagerBudgetRepository managerBudgetRepository;

	@Autowired
	private ProjectBudgetRepository projectBudgetRepository;
	
	@Autowired
	private ProjectRepository projectRepository;

	// Method to calculate final project budget with and without material
	public ProjectBudget createProjectBudget(Long projectId, Long managerBudgetId, BigDecimal materialCost,
			BigDecimal profitMargin) {
          // Get the manager's estimated budget
		ManagerBudget managerBudget = managerBudgetRepository.findById(managerBudgetId)
				.orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerBudgetId));

          // Get the project entity and validate its existence
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

          // Update the project's status to "Not Assigned"
		project.setStatus("NOT_ASSIGNED");
		projectRepository.save(project);

          // Get the estimated budget from the manager's budget (as BigDecimal)
		BigDecimal estimatedBudget = managerBudget.getEstimatedBudget();

          // Get the manager who provided the budget
		Manager manager = managerBudget.getManager(); // Assuming ManagerBudget has a reference to Manager

          // Create the final project budget with two scenarios, including the manager
		ProjectBudget projectBudget = new ProjectBudget(managerBudget.getProject(), manager, managerBudget,
				estimatedBudget, materialCost, profitMargin);

          // Save or update the project budget
		return projectBudgetRepository.save(projectBudget);
	}

	// Method to retrieve the project budget
	public ProjectBudget getProjectBudget(Long projectId) {
		return projectBudgetRepository.findById(projectId)
				.orElseThrow(() -> new IllegalArgumentException("ProjectBudget not found"));
	}

	// Method to find all project budgets
	public List<ProjectBudget> getAllProjectBudgets() {
		return projectBudgetRepository.findAll(); // Returns a list of all project budgets
	}
}
