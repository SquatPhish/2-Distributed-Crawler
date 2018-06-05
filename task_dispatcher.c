//author ketian
//ririhedou@gmail.com

#define _XOPEN_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#define WATHEVER_CMD_PREFIX "node main.js --id=%d"
//Separate the main task into different pieces, each piece is assigned with an ID

#define PROC_MAX 5
//The maximum processes the machine can tolerate
//5X Fast

//you can customize the work with any task.
void work(int i)
{
    char buf[1024];
    snprintf(buf, 1024, WATHEVER_CMD_PREFIX, i);
    //use snprintf to avoid buffer overflow
    system(buf);
}


int main(int argc, char** argv)
{
    //int ppid = getpid();
    if (argc<3)
    {
        //usage();
        exit(-1);
    }
    int start_val = atoi(argv[1]);
    int stop_val = atoi(argv[2]);

    int shmid = shmget(IPC_PRIVATE, sizeof(int), IPC_CREAT | 0666);
    if (shmid<0)
    {
        exit(-1);
    }

    signal(SIGCHLD, SIG_IGN);
    //to prevent zombie processes

    int* counter;
    counter = shmat(shmid, NULL, 0);
    *counter = 0;

    for (int i=start_val; i<=stop_val; i++)
    {
        int cpid;
        //retry counter
        int rcnt = 0;
        //respwaning new task, increase counter by one
        while(!__sync_bool_compare_and_swap(counter,*counter, (*counter) +1));
retry:
        cpid = fork();
        rcnt++;
        if (cpid==0)
        {
            work(i);
            while(!__sync_bool_compare_and_swap(counter,*counter, (*counter)-1));
            printf("[SPONGEBOB]Done %d counter=%d\n", i, *counter);
            shmdt(counter);
            exit(-1);
        }
        else if (cpid==-1)
        {
            //failed to fork...
            printf("[SPONGEBOB]Fail to fork on id=%d...\n", i);
            if (rcnt>100)
            {
                goto out; //we re-try 100 times
            }
            goto retry;
        }
out:
        while (*counter>=PROC_MAX)
        {
            sleep(10);
        }
    }

    printf("[SPONGEBOB] Done and exit");
    exit(0);
}
