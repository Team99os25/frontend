'use client';
import { useEffect, useState, useRef, use } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';



export default function SummaryPage() {
    const params = useParams();
    const session_id = params?.session_id as string;


}