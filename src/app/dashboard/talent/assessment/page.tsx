"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { TalentProfileContext } from "../context";
import { userStore } from "@/lib/store";

import { updateTalentProfile } from "@/app/dashboard/actions";
import { questions } from "@/lib/questions";
import { talentProfiles } from "@/lib/shared";

import { Question, ProfileCompletion } from "@/types";

export interface TalentProfile {
	id: string;
	title: string;
	icon: string;
	description: string;
	minScore: number;
	maxScore: number;
	bestFit: string[];
}

export interface AssessmentResult {
	score: number;
	profile: TalentProfile;
}

//   // src/utils/assessment.ts

//   import { talentProfiles } from '../data/talent-profiles';
//   import { questions } from '../data/questions';
//   import { AssessmentResult, TalentProfile } from '../types';

export const calculateResult = (answers: Record<number, string>): AssessmentResult => {
	// Calculate total score
	let totalScore = 0;

	Object.entries(answers).forEach(([questionId, optionLabel]) => {
		const question = questions.find((q) => q.id === parseInt(questionId));
		const option = question?.options.find((o) => o.label === optionLabel);
		if (option) {
			totalScore += option.points;
		}
	});

	// Find matching profile
	const profile = talentProfiles.find((profile) => totalScore >= profile.minScore && totalScore <= profile.maxScore) || talentProfiles[talentProfiles.length - 1]; // Default to the last profile if none matches

	return {
		score: totalScore,
		profile,
	};
};

const calculateResultFromScore = (score: number): AssessmentResult => {
	const profile = talentProfiles.find((profile) => score >= profile.minScore && score <= profile.maxScore) || talentProfiles[talentProfiles.length - 1]; // Default to the last profile if none matches

	return {
		score,
		profile,
	};
};

export default function Page() {
	const user = userStore((state) => state.user);
	const context = useContext(TalentProfileContext);

	const profileCompletionStatus = context?.profileCompletionStatus as ProfileCompletion;

	// controls what part of the assessment is being shown
	// 0: Instructions, 1: Questions, 2: Results
	const [step, setStep] = useState(0);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [showWarning, setShowWarning] = useState(false);

	const [result, setResult] = useState<AssessmentResult | null>(null);

	const currentQuestion: Question = questions[currentQuestionIndex];

	const handleSelectOption = (optionLabel: string) => {
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: optionLabel,
		}));

		// Move to next question after selecting an option
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			// If all questions are answered, proceed to results
			handleSubmit();
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
		}
	};

	const handleSubmit = async () => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			if (Object.keys(answers).length < questions.length) {
				setShowWarning(true);
				return;
			}

			const result = calculateResult(answers);
			setResult(result);

			const res = await updateTalentProfile(
				{
					assessmentScore: result.score,
					profileCompletionStatus: {
						personalInfo: profileCompletionStatus.personalInfo,
						educationExperience: profileCompletionStatus.educationExperience,
						preferences: profileCompletionStatus.preferences,
						assessment:true,
						overallComplete: profileCompletionStatus.overallComplete,
					},
					
				},
				user.id,
			);
			if (res.status == 400) {
				throw new Error(res.message);
			}
			setStep(2);
			toast.success(res.message);
		} catch (error: any) {
			toast.error("An error occured", {
				description: (error.message as string) + ". Please try again",
			});
		}
	};

	// Hide warning when an answer is selected
	useEffect(() => {
		if (showWarning) {
			setShowWarning(false);
		}
	}, [answers]);

	useEffect(() => {
		const submittedAssessmentScore = context?.assessmentScore;
		if (submittedAssessmentScore) {
			setResult(calculateResultFromScore(submittedAssessmentScore));
			setStep(2);
		}
	}, []);

	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	if(step>2){
		throw new Error("Invalid step");
	}

	if (step === 0) {
		return (
			<div className="flex w-full max-w-xl flex-1 flex-col gap-5">
				<h1 className="text-md font-semibold">Wíra Entry-level Launchpad Assessment</h1>

				<div className="mb-6">
					<p className="text-muted-foreground">This short, 15-question test is designed to evaluate your workplace strengths, decision-making style, and career fit based on real-world scenarios.</p>
					<p className="text-muted-foreground">It helps employers assess your skills, culture-fit and potential. There are no right or wrong answers—just choose the response that best reflects how you think and work!</p>
					<p className="font-medium text-neutral-600">Estimated time: 15 minutes</p>
				</div>
				<Button size={"lg"} className="w-fit" onClick={() => setStep(1)}>
					Start Assessment
				</Button>
			</div>
		);
	}
	if (step === 1) {
		return (
			<div className="flex w-full max-w-xl flex-1 flex-col gap-5">
				<h1 className="text-md font-semibold">Wíra Entry-level Launchpad Assessment</h1>

				<div className="mb-8">
					<div className="mb-2 flex items-center justify-between">
						<h2 className="font-semibold text-neutral-700">
							Question {currentQuestionIndex + 1} of {questions.length}
						</h2>
						<span className="text-sm text-neutral-500">{progress.toFixed(0)}% Complete</span>
					</div>

					<div className="h-2 w-full rounded-full bg-neutral-200">
						<div className="h-2 rounded-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
					</div>
				</div>

				<div className="mb-8">
					<h1 className="mb-4 text-xl font-bold text-neutral-800">{currentQuestion.text}</h1>

					<div className="space-y-3">
						{currentQuestion.options.map((option) => (
							<button key={option.label} onClick={() => handleSelectOption(option.label)} className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-primary-50 ${answers[currentQuestion.id] === option.label ? "border-primary-600 bg-primary-50" : "border-neutral-200"}`}>
								<span className="mr-3 inline-block h-6 w-6 rounded-full bg-primary-100 text-center font-medium text-primary-600">{option.label}</span>
								{option.value}
							</button>
						))}
					</div>

					{showWarning && <div className="mt-4 text-sm text-red-500">Please answer all questions before submitting.</div>}
				</div>

				<div className="flex justify-between">
					<Button variant={"secondary"} size={"lg"} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
						Previous
					</Button>

					{currentQuestionIndex === questions.length - 1 && (
						<Button size={"lg"} onClick={handleSubmit}>
							Submit
						</Button>
					)}
				</div>
			</div>
		);
	}
	if (step === 2) {
		if (!result) {
			toast.error("An error occurred while calculating your results. Please try again.");
			setStep(0);
			setResult(null);
			setCurrentQuestionIndex(0);
			return <></>;
		}
		return (
			<main className="my-8 w-full max-w-3xl rounded-lg md:p-8">
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-bold text-primary">Your Assessment Results</h1>
					<p className="text-neutral-600">Based on your responses, here's your talent profile:</p>
				</div>

				<div className="mb-8 rounded-lg bg-primary-50 p-6">
					<div className="mb-4 flex items-center">
						<span className="mr-4 text-4xl">{result.profile.icon}</span>
						<div>
							<h2 className="text-2xl font-bold text-primary-800">{result.profile.title}</h2>
							<p className="text-neutral-500">Score: {result.score} points</p>
						</div>
					</div>

					<p className="mb-4 text-neutral-700">{result.profile.description}</p>

					<div>
						<h3 className="mb-2 font-semibold text-primary-700">Best Career Fits:</h3>
						<div className="flex flex-wrap gap-2">
							{result.profile.bestFit.map((career, index) => (
								<span key={index} className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800">
									{career}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="text-center">
					<button
						onClick={() => {
							setStep(1);
							setResult(null);
							setCurrentQuestionIndex(0);
						}}
						className="rounded-md bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
					>
						Take Assessment Again
					</button>
				</div>
			</main>
		);
	}
	else{
		return <></>;
	}
}

//   // src/pages/results.tsx

//   import { useRouter } from 'next/router';
//   import { useEffect, useState } from 'react';
//   import Head from 'next/head';
//   import { AssessmentResult } from '../types';
//   import { calculateResult } from '../utils/assessment';

//   export default function Results() {
//     const router = useRouter();
//     const [result, setResult] = useState<AssessmentResult | null>(null);

//     useEffect(() => {
//       // Retrieve answers from session storage
//       const storedAnswers = sessionStorage.getItem('assessmentAnswers');

//       if (!storedAnswers) {
//         // If no answers are found, redirect to the assessment page
//         router.replace('/assessment');
//         return;
//       }

//       // Calculate the result based on answers
//       const answers = JSON.parse(storedAnswers);
//       const assessmentResult = calculateResult(answers);
//       setResult(assessmentResult);
//     }, [router]);

//     if (!result) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
//         </div>
//       );
//     }

//     return (
//       <div className="min-h-screen bg-neutral-50 flex flex-col items-center p-4">
//         <Head>
//           <title>Your Results | Wíra Talent Assessment</title>
//         </Head>

// <main className="bg-white p-8 rounded-lg shadow-md max-w-3xl w-full my-8">
//   <div className="text-center mb-8">
//     <h1 className="text-3xl font-bold text-primary-700 mb-2">Your Assessment Results</h1>
//     <p className="text-neutral-600">Based on your responses, here's your talent profile:</p>
//   </div>

//   <div className="bg-primary-50 rounded-lg p-6 mb-8">
//     <div className="flex items-center mb-4">
//       <span className="text-4xl mr-4">{result.profile.icon}</span>
//       <div>
//         <h2 className="text-2xl font-bold text-primary-800">{result.profile.title}</h2>
//         <p className="text-neutral-500">Score: {result.score} points</p>
//       </div>
//     </div>

//     <p className="text-neutral-700 mb-4">{result.profile.description}</p>

//     <div>
//       <h3 className="font-semibold text-primary-700 mb-2">Best Career Fits:</h3>
//       <div className="flex flex-wrap gap-2">
//         {result.profile.bestFit.map((career, index) => (
//           <span
//             key={index}
//             className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
//           >
//             {career}
//           </span>
//         ))}
//       </div>
//     </div>
//   </div>

//   <div className="text-center">
//     <button
//       onClick={() => router.push('/')}
//       className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
//     >
//       Take Assessment Again
//     </button>
//   </div>
// </main>
//       </div>
//     );
//   }
