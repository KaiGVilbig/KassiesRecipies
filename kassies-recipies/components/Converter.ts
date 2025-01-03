import { ingredient, conversion } from "@/interfaces";

export default function toGrams(ingredient: ingredient, conversion: conversion) {
    let inGrams: number = ingredient.value * conversion.toGrams;

    return inGrams;
}