import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { task_id } = await request.json();
    const supabase = createServerSupabaseClient();

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || 'demo-user-id'; // Fallback for demo

    // In a real app we'd update the row in Supabase:
    // await supabase.from('repair_tasks').update({
    //   status: 'dispatched',
    //   dispatched_at: new Date().toISOString(),
    //   dispatched_by: userId
    // }).eq('task_id', task_id);

    // We would also update the ward_health score:
    // const { data: health } = await supabase.from('ward_health').select('health_score').eq('ward_id', 'ward78').single();
    // await supabase.from('ward_health').update({ health_score: Math.min(1.0, health.health_score + 0.05) }).eq('ward_id', 'ward78');

    return NextResponse.json({ success: true, message: `Task ${task_id} dispatched` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to dispatch task' }, { status: 500 });
  }
}
